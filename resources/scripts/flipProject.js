/* This script flips project cards when clicked */


const flip = ({currentTarget}) => {
  if (currentTarget.style.transform === 'rotateY(180deg)') {
    currentTarget.style.transform = 'rotateY(0deg)';
  } else {
    currentTarget.style.transform = 'rotateY(180deg)';
  }
};