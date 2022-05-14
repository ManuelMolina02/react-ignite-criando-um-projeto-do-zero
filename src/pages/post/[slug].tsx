import { GetStaticPaths, GetStaticProps } from 'next';
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';
import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps) {
  const router = useRouter();

  const content = post.data.content.reduce((acc, item) => {
    return [...acc, ...item.body];
  }, []);

  const concatContent = content.reduce((acc, item) => {
    return `${acc} ${item.text}`;
  }, '');

  function readingAverage(text: string) {

    const countWords = text.split(' ').length;
    const calcAverage = (countWords / 200)

    return Math.ceil(calcAverage);
  }


  return (

    <div className={styles.postContainer}>

      {
        router.isFallback ?
          'Carregando...'
          :
          <>
            <img src={post.data.banner.url} alt="banner" />


            <section className={styles.postContent}>
              <div>
                <h1>{post.data.title}</h1>
                <p>
                  <span>
                    <FaCalendar />
                    {
                      format(new Date(post.first_publication_date), 'dd MMM yyyy', {
                        locale: ptBR,
                      })
                    }
                  </span>

                  <span>
                    <FaUser />
                    {post.data.author}
                  </span>

                  <span>
                    <FaClock />
                    {readingAverage(concatContent)} min
                  </span>
                </p>

              </div>

              {
                post.data.content.map((content) => (
                  <div key={content.heading} className={styles.postContent}>
                    <h2>{content.heading}</h2>

                    {
                      content.body.map((body) => (
                        <p key={body.text}>{body.text}</p>
                      ))
                    }
                    <br />
                  </div>
                ))
              }
            </section>
          </>
      }

    </div>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const posts = await prismic.getByType('posts', {
    fetch: ['data.title', 'data.author', 'data.banner', 'first_publication_date']

  });

  return {
    paths: posts.results.map(post => ({
      params: {
        slug: post.uid,
      },
    })),
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const prismic = getPrismicClient({});
  const param = String(params.slug);

  const response = await prismic.getByUID('posts', param, {
    fetch: ['data.title', 'data.author', 'data.banner', 'first_publication_date', 'data.content']
  });


  const post = {
    first_publication_date: response.first_publication_date,
    uid: response.uid,

    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: {
        url: response.data.banner.url,
      },
      author: response.data.author,
      content: response.data.content.map(content => ({
        heading: content.heading,
        body: content.body.map(body => ({
          spans: body.spans,
          text: body.text,
          type: body.type
        }))
      })),

    }
  };

  return {
    props: {
      post
    },

    revalidate: 60 * 60 * 24
  }

};
