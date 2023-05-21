import { useEffect, useState } from 'react';
// import reactLogo from './assets/react.svg';
// import viteLogo from '/vite.svg';
import './App.css';
import axios from 'axios';
// import css from './components/card/card.module.css';
import css from './card/card.module.css';
import logo from '../assets/Logo.png';
import tweetsPicture from '../assets/picture.png';

axios.defaults.baseURL = 'https://646513529c09d77a62e2dde1.mockapi.io';

function App() {
  const [users, setUsers] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [countFollowing, setCountFollowing] = useState(null);
  const [limit, setLimit] = useState(3);

  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await axios.get(`/users`);
        return response.data;
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchAllUsers().then(data => {
      setAllUsers(data);
    });
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      let page = 1;
      const optionsPagination = `?page=${page}&limit=${limit}`;
      try {
        const response = await axios.get(`/users${optionsPagination}`);
        return response.data;
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchUsers().then(data => {
      setUsers(data);
    });
  }, [countFollowing, limit]);

  const userCard = users.map(item => {
    function numberWithCommas(x) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    const follow = async () => {
      await axios.put(`/users/${item.id}`, { followers: 1000 });
      localStorage.setItem(item.id, 'following');
      setCountFollowing(localStorage.length);
    };

    const cancelFollowing = () => {
      axios.put(`/users/${item.id}`, { followers: item.followers - 1 });
      localStorage.removeItem(item.id);
      setCountFollowing(localStorage.length);
    };
    const followBtn = () => {
      return (
        <button className={css.followBtn} type="button" onClick={follow}>
          Follow
        </button>
      );
    };

    const followingBtn = () => {
      return (
        <button className={css.followingBtn} type="button" onClick={cancelFollowing}>
          Following
        </button>
      );
    };

    return (
      <li key={item.id} className={css.card}>
        <div className={css.logo}>
          <img src={logo} alt="Logotipe" />
        </div>
        <div className={css.tweet}>
          <img src={tweetsPicture} alt="Tweet" />
        </div>
        <div className={css.line}>
          <div className={css.avatarOverlay}>
            <img className={css.avatar} src={item.avatar} alt="Avatar" height="62" />
          </div>
        </div>
        <p className={css.quantityTweets}>{item.tweets} tweets </p>
        <p className={css.quantityFollowers}>{numberWithCommas(item.followers)} followers</p>
        {localStorage.getItem(item.id) === 'following' ? followingBtn() : followBtn()}
      </li>
    );
  });

  const loadMore = () => setLimit(prevState => prevState + 3);

  return (
    <>
      <h1>Tweets!!!</h1>
      <ul>{userCard}</ul>
      {allUsers.length !== users.length ? (
        <button type="button" onClick={loadMore}>
          Load more
        </button>
      ) : (
        <p>Loaded is all</p>
      )}
    </>
  );
}

export default App;
