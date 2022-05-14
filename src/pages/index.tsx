import { GetStaticProps } from 'next';
import { getPrismicClient } from '../services/prismic';
import { AiOutlineCalendar } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import Link from 'next/link';
import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import { format } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { useState } from 'react';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

  const [posts, setPosts] = useState(postsPagination.results)
  const [nextPage, setNextPage] = useState(postsPagination.next_page)

  async function handleNewPosts() {

    const response = await fetch(nextPage);
    const json = await response.json();

    setPosts([...posts, ...json.results])

    if (json.total_pages === posts.length + 1) {
      setNextPage(null)
    }

    console.log(json);


  }

  return (
    <section className={styles.postsContainer}>

      <div className={styles.postsContent}>
        {posts.map((post) => (
          <div key={post.uid} className={styles.post} >
            <Link href={`/post/${post.uid}`} >
              <h1>
                {post.data.title}
              </h1>
            </Link>
            <p>{post.data.subtitle}</p>
            <div>
              <span>
                <AiOutlineCalendar />
                {
                  format(new Date(post.first_publication_date), 'dd MMM yyyy', { locale: ptBR })
                }
              </span>
              <span>
                <FiUser />
                {post.data.author}
              </span>
            </div>
          </div>
        ))}
      </div>
      {
        nextPage && (
          <button onClick={() => handleNewPosts()}>Carregar mais posts</button>
        )
      }

    </section>
  )
}
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('posts', {
    fetch: ['data.uid', 'data.title', 'data.subtitle', 'data.author', 'first_publication_date'],
    pageSize: 1,
    page: 1,
  });

  //retornar o resultado da requisição de acordo com a interface Posts[]
  const posts = postsResponse.results.map((post) => {

    return {
      uid: post.uid,
      first_publication_date: post.first_publication_date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  })

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: posts,
      },

    },
    revalidate: 60 * 60 * 24, // 1 day
  };
}
