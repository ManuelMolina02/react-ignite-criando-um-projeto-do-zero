import { GetStaticPaths, GetStaticProps } from 'next';
import { FaCalendar, FaUser, FaClock } from 'react-icons/fa';

import { getPrismicClient } from '../../services/prismic';

import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

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

export default function Post({ post }) {

  return (
    <div className={styles.postContainer}>
      <img src={'/images/banner.png'} alt="banner" />


      <section className={styles.postContent}>
        <div>
          <h1>{post?.title || 'test title example'}</h1>
          <p>
            <span>
              <FaCalendar />
              {post?.first_publication_date || '20 mar 2002'}
            </span>

            <span>
              <FaUser />
              {post?.author || 'test author'}
            </span>

            <span>
              <FaClock />
              {post?.time_to_read || '4 min'}
            </span>
          </p>

        </div>

        <div>
          <h2>Proin et varius</h2>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Nullam dolor sapien, vulputate eu diam at, condimentum hendrerit tellus. Nam facilisis sodales felis, pharetra pharetra lectus auctor sed.
            Ut venenatis mauris vel libero pretium, et pretium ligula faucibus. Morbi nibh felis, elementum a posuere et, vulputate et erat. Nam venenatis.</p>

          <br />

          <h2>Cras laoreet mi</h2>
          <p>Nulla auctor sit amet quam vitae commodo. Sed risus justo, vulputate quis neque eget, dictum sodales sem. In eget felis finibus, mattis magna a, efficitur ex. Curabitur vitae justo consequat sapien gravida auctor a non risus. Sed malesuada mauris nec orci congue, interdum efficitur urna dignissim. Vivamus cursus elit sem, vel facilisis nulla pretium consectetur. Nunc congue.

            Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Aliquam consectetur massa nec metus condimentum, sed tincidunt enim tincidunt. Vestibulum fringilla risus sit amet massa suscipit eleifend. Duis eget metus cursus, suscipit ante ac, iaculis est. Donec accumsan enim sit amet lorem placerat, eu dapibus ex porta. Etiam a est in leo pulvinar auctor. Praesent sed vestibulum elit, consectetur egestas libero.</p>
        </div>


      </section>

    </div>
  )
}

// export const getStaticPaths = async () => {
//   const prismic = getPrismicClient({});
//   const posts = await prismic.getByType(TODO);

//   // TODO
// };

// export const getStaticProps = async ({params }) => {
//   const prismic = getPrismicClient({});
//   const response = await prismic.getByUID(TODO);

//   // TODO
// };
