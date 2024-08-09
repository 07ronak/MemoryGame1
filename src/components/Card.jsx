const Card = ({ image, selected, onClick }) => {
  return (
    <div className="card">
      <div className={selected && 'selected'}>
        {/* this div has class 'selected' only when the selected condition is true */}
        <img src={image} alt="" className="card-face" />
        {/* front face of card */}
        <img
          /* back face of card (the one we see initially)*/
          src={'/assets/firebase.png'}
          alt=""
          className="card-back"
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default Card;
