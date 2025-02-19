const wsClient = new window.SubscriptionsTransportWs.SubscriptionClient('ws://localhost:4000/graphql', {
    reconnect: true,
  });
  
  const captionSub = `
    subscription {
      captionTriggered {
        id
        playerOutName
        playerOutNumber
        playerInName
        playerInNumber
        substitutionTime
      }
    }
  `;
  
  wsClient.request({ query: captionSub }).subscribe({
    next({ data }) {
      if (data && data.captionTriggered) {
        displayCaption(data.captionTriggered);
      }
    },
    error(err) {
      console.error('Subscription error:', err);
    }
  });
  
  const hideSub = `
    subscription {
      captionHidden
    }
  `;
  
  wsClient.request({ query: hideSub }).subscribe({
    next({ data }) {
      if (data && data.captionHidden) {
        hideCaption();
      }
    },
    error(err) {
      console.error('Hide subscription error:', err);
    }
  });
  
  function displayCaption(caption) {
    document.getElementById('playerOutName').textContent = caption.playerOutName;
    document.getElementById('playerOutNumber').textContent = caption.playerOutNumber;
    document.getElementById('playerInName').textContent = caption.playerInName;
    document.getElementById('playerInNumber').textContent = caption.playerInNumber;
    document.getElementById('subTime').textContent = 'Time: ' + caption.substitutionTime;
  
    const container = document.getElementById('captionContainer');
    container.style.display = 'block';
    container.style.animationName = 'slideIn';
  
    setTimeout(hideCaption, 5000);
  }
  
  function hideCaption() {
    const container = document.getElementById('captionContainer');
    container.style.animationName = 'slideOut';
    setTimeout(() => {
      container.style.display = 'none';
    }, 500);
  }
  