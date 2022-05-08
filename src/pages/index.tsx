import { GetStaticProps } from 'next';

import { getPrismicClient } from '../services/prismic';

import { FaCalendar, FaUser } from 'react-icons/fa';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

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

interface exampleProps {
  posts: {
    title: string;
    subtitle: string;
    author: string;
    createdAt: string;
  }[]
}

export default function Home({ posts }: exampleProps) {

  return (
    <section className={styles.postsContainer}>

      <div className={styles.postsContent}>
        {posts.map((post) => (
          <div key={post.uid} className={styles.post}>
            <h1>{post.title}</h1>
            <p>{post.subtitle}</p>
            <div>
              <span>
                <FaCalendar />
                {post.createdAt}
              </span>
              <span>
                <FaUser />
                {post.author}
              </span>
            </div>
          </div>
        ))}
      </div>


      {/*
      <ul>
        {posts.results?.map((post) => (
          <li key={post.uid}>
            <h3>{post.data.title}</h3>
            <p>{post.data.subtitle}</p>
            <p>{post.data.author}</p>
          </li>
        ))}
      </ul>
    */}
      <button>Carregar mais posts</button>

    </section>
  )
}
export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post');

  const exampleData = [
    {
      uid: '1',
      title: 'Como utilizar Hooks',
      subtitle: 'Pensando em sincronização em vez de ciclos de vida.',
      createdAt: '15 Mar 2021',
      author: 'John Doe',
    },
    {
      uid: '2',
      title: 'Criando um app CRA do zero',
      subtitle: 'Tudo sobre como criar a sua primeira aplicação utilizando Create React App',
      createdAt: '19 Abr 2021',
      author: 'Jefferson Doe 2',
    },
    {
      uid: '3',
      title: 'Criando um app CRA doost 3',
      subtitle: 'Pensando em sincronização em vez de ciclos de vida.',
      createdAt: '19 Abr 2021',
      author: 'Clarice Doe',
    },
    {
      uid: '4',
      title: 'Criando um app CRA doost 3',
      subtitle: 'Pensando em sincronização em vez de ciclos de vida.',
      createdAt: '19 Abr 2021',
      author: 'Clarice Doe',
    }
  ]


  return {
    props: {
      posts: exampleData,
    },
    revalidate: 60 * 60 * 24, // 1 day

  };
}
