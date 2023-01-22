import { stateContext } from 'Contexts/StateContext';
import { useContext, useEffect, useState } from 'react';

import axios from 'axios';
import { io } from 'socket.io-client';

import isEmpty from 'Functions/isEmpty';

const HandleStreamElements = (props: any) => {
  const [state, setState] = useContext(stateContext);

  const [channel, setChannel] = useState('test');
  const [incoming, setIncoming] = useState<any>({});

  const [latestCheer, setLatestCheer] = useState<any>({});
  const [latestFollow, setLatestFollow] = useState<any>({});
  const [latestSub, setLatestSub] = useState<any>({});
  const [latestTip, setLatestTip] = useState<any>({});

  //* This effect is for updating incoming data from streamelements
  useEffect(() => {
    if (!isEmpty(incoming)) {
      setState({
        ...state,
        streamElementsSubscribed: true,
        streamElements: { ...incoming },
      });
    }
    //eslint-disable-next-line
  }, [incoming]);

  useEffect(() => {
    if (!isEmpty(latestCheer)) {
      const update = { ...incoming };
      update['cheer-latest'] = {
        name: latestCheer.name,
        amount: latestCheer.amount,
        message: latestCheer.message,
      };
      update['cheer-recent'].unshift({ ...latestCheer });
      setIncoming({ ...update });
    }
    //eslint-disable-next-line
  }, [latestCheer]);

  useEffect(() => {
    if (!isEmpty(latestTip)) {
      const update = { ...incoming };
      update['tip-latest'] = {
        name: latestTip.name,
        amount: latestTip.amount,
        message: latestTip.message,
      };
      update['tip-recent'].unshift({ ...latestTip });
      setIncoming({ ...update });
    }
    //eslint-disable-next-line
  }, [latestTip]);

  //* This effect is for updating the latest follower from streamelements
  useEffect(() => {
    if (!isEmpty(latestFollow)) {
      const update = { ...incoming };
      update['follower-latest'] = { name: latestFollow.name };
      update['follower-recent'].unshift({ ...latestFollow });
      setIncoming({ ...update });
    }
    //eslint-disable-next-line
  }, [latestFollow]);

  //* This effect is for updating the latest subscriber from streamelements
  useEffect(() => {
    if (!isEmpty(latestSub)) {
      const update = { ...incoming };
      update['subscriber-latest'] = {
        amount: latestSub.amount,
        gifted: latestSub.gifted,
        message: latestSub.message,
        name: latestSub.name,
        sender: latestSub.sender,
        tier: latestSub.tier,
      };
      update['subscriber-recent'].unshift({ ...latestSub });
      setIncoming({ ...update });
    }
    //eslint-disable-next-line
  }, [latestSub]);

  //* Generate timestamps that match the format of those from streamelements API
  const get_date_format = (myDate: any) => {
    let month = myDate.getMonth() + 1;

    // helper function
    const addZeroIfNeeded = (num: number) => {
      return num < 10 ? '0' + num : num.toString();
    };

    month = addZeroIfNeeded(month);
    let day = addZeroIfNeeded(myDate.getDate());

    let year = myDate.getFullYear();
    let hours = addZeroIfNeeded(myDate.getHours());
    let mins = addZeroIfNeeded(myDate.getMinutes());
    let seconds = addZeroIfNeeded(myDate.getSeconds());

    return `${year}-${month}-${day}T${hours}:${mins}:${seconds}Z`;
  };

  //* Initial fetch for streamelements data
  const fetchData = async () => {
    const data = await axios.get(
      `https://api.streamelements.com/kappa/v2/sessions/${channel}`,
      {
        headers: { Authorization: `Bearer ${state.streamElementsKey}` },
      }
    );
    setIncoming(data.data.data);
  };

  //* Subscribe to streamelements websocket using socket.io
  const subStreamElements = async () => {
    let JWT = state.streamElementsKey;
    const sesocket = io('https://realtime.streamelements.com', {
      transports: ['websocket'],
      autoConnect: true,
    });

    // Socket connected
    sesocket.on('connect', onConnect);
    sesocket.on('connect_error', (err: any) => {
      console.log('connection error');
      console.log(err);
    });
    sesocket.on('error', (err: any) => {
      console.log('socket error');
    });
    // Socket got disconnected
    sesocket.on('disconnect', onDisconnect);
    // Socket is authenticated
    sesocket.on('authenticated', onAuthenticated);
    //! SE Test events - updates live app state if debug queryparam is enabled
    state.debug &&
      sesocket.on('event:test', (data: any) => {
        if (data.listener === 'follower-latest') {
          let currentDate = new Date();
          let timestamp = get_date_format(currentDate);
          const newFollow = { name: data.event.name, createdAt: timestamp };
          setLatestFollow({ ...newFollow });
        }
        if (data.listener === 'subscriber-latest') {
          let currentDate = new Date();
          let timestamp = get_date_format(currentDate);
          const newSub = {
            name: data.event.name,
            tier: data.event.tier,
            amount: data.event.amount,
            createdAt: timestamp,
          };
          setLatestSub({ ...newSub });
        }
        if (data.listener === 'cheer-latest') {
          let currentDate = new Date();
          let timestamp = get_date_format(currentDate);
          const newCheer = {
            amount: data.event.amount,
            message: data.event.message,
            name: data.event.name,
            createdAt: timestamp,
          };
          setLatestCheer({ ...newCheer });
        }
        if (data.listener === 'tip-latest') {
          let currentDate = new Date();
          let timestamp = get_date_format(currentDate);
          const newTip = {
            amount: data.event.amount,
            message: data.event.message,
            name: data.event.name,
            createdAt: timestamp,
          };
          setLatestTip({ ...newTip });
        }
      });
    //! Live SE event message logic.
    sesocket.on('event', (data: any) => {
      if (data.listener === 'follower-latest') {
        let currentDate = new Date();
        let timestamp = get_date_format(currentDate);
        const newFollow = { name: data.event.name, createdAt: timestamp };
        setLatestFollow({ ...newFollow });
      }
      if (data.listener === 'subscriber-latest') {
        let currentDate = new Date();
        let timestamp = get_date_format(currentDate);
        const newSub = {
          name: data.event.name,
          tier: data.event.tier,
          amount: data.event.amount,
          createdAt: timestamp,
        };
        setLatestSub({ ...newSub });
      }
      if (data.listener === 'cheer-latest') {
        let currentDate = new Date();
        let timestamp = get_date_format(currentDate);
        const newCheer = {
          amount: data.event.amount,
          message: data.event.message,
          name: data.event.name,
          createdAt: timestamp,
        };
        setLatestCheer({ ...newCheer });
      }
      if (data.listener === 'tip-latest') {
        let currentDate = new Date();
        let timestamp = get_date_format(currentDate);
        const newTip = {
          amount: data.event.amount,
          message: data.event.message,
          name: data.event.name,
          createdAt: timestamp,
        };
        setLatestTip({ ...newTip });
      }
    });
    // SE connect logic, run auth function on socket open
    function onConnect() {
      state.debug && console.log('WS. INFO: Socket Opened -> STREAMELEMENTS');
      sesocket.emit('authenticate', {
        method: 'jwt',
        token: JWT,
      });
    }
    // SE disconnect logic. !!TODO!!
    function onDisconnect() {
      state.debug &&
        console.log(
          'WS. RECV: <- STREAMELEMENTS: Disconnected from  websocket'
        );
      // Reconnect
    }
    // After successful auth, log channel info to console
    function onAuthenticated(data: any) {
      const { channelId } = data;
      setChannel(channelId);
      state.debug &&
        console.log(
          `WS. RECV: <- STREAMELEMENTS: Successfully connected to channel ${channelId}`
        );
      state.debug && console.log(data);
    }
  };

  useEffect(() => {
    state.streamElementsKey && subStreamElements();
    //eslint-disable-next-line
  }, [state.streamElementsKey]);

  useEffect(() => {
    channel !== 'test' && fetchData();
    //eslint-disable-next-line
  }, [channel]);

  return props.children;
};

export default HandleStreamElements;
