import { useState } from 'react'; 
import cn from "classnames";

function FlipCard({ Front, Back }) {
  const [showBack, setShowBack] = useState(false); 

  function handleClick() { 
    if (!showBack)
      setShowBack(!showBack); 
  } 

  return (
    <div
      className="flip-card-outer"
      onClick={handleClick} 
    >
      <div
        className={cn("flip-card-inner", {
          showBack,
        })}
      >
        <div className="card front">
            <Front />
        </div>
        <div className="card back">
            <Back />
        </div>
      </div>
    </div>
  );
}

export default FlipCard;
