import { Box, Card, Text } from '@theme-ui/components';
import { useEffect, useState } from 'react'
import { ALARM_STATUS } from 'shared/constants';
import io from 'socket.io-client'
import useSWR from 'swr';

const channel = process.env.NEXT_PUBLIC_IS_MONITORING_ENABLED;

const Home = () => {

  const [isMonitoringEnabled, setIsMonitoringEnabled] = useState(false);
  const [alarm, setAlarm] = useState({});

  useEffect(() => {

    fetch('/api/alarm').finally(() => {
      const socket = io();

      socket.on('connect', () => {
        console.log('connected');
      })

      socket.on(channel, data => {
        setIsMonitoringEnabled(data); 
      })

      socket.on('alarms', data => {
        setAlarm(data);
      });

      socket.on('disconnect', () => {
        console.log('disconnected');
      })
    })
  }, []);

  // render data
  return <div sx={{display: 'flex', flexDirection: 'column'}}>

    {alarm.status === 2000 && alarm.data.map((a, i) => (
      <Card key={i} variant={ a.status === ALARM_STATUS.CRITICAL ? 'critical' : ( a.status === ALARM_STATUS.MAJOR ? 'major' : 'minor' )}>
        <Box>
          <Text>Name: {a.name}</Text>
        </Box>
        <Box>
          <Text>Status: {a.status}</Text>
        </Box>
      </Card>
    ))}

    {alarm.status === 3000 && <div>{alarm.message}</div>}

  </div>

}

export default Home;