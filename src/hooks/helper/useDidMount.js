import React from 'react';

export default function useDidMount() {
  const [didMount, setDidMount] = React.useState(false);

  React.useEffect(() => {
    setDidMount(true);
  }, []);
  return didMount;
}
