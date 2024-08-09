//Combine and shuffle two arrays
const shuffle = () => {
  const assets = [
    { image: '/assets/css.png' },
    { image: '/assets/html5.png' },
    { image: '/assets/jquery.png' },
    { image: '/assets/js.png' },
    { image: '/assets/next.png' },
    { image: '/assets/node.png' },
    { image: '/assets/react.png' },
    { image: '/assets/ts.png' },
  ];
  return [...assets, ...assets] //spread syntax to combine both objects to create 16 cards
    .sort(() => Math.random() - 0.5) //combining it with sort method to randomly sort the array everytime this function is called. That will give us a random arryay of objects.
    .map((card) => ({ ...card, id: Math.random() })); //this step will add a random id for each card. This id will be used by REACT (for key) as we loop over each card.
};

export default shuffle;
