const contents = document.querySelectorAll('.content');

const footer_height = (document.getElementById("footer").getBoundingClientRect().height / document.documentElement.clientHeight) * 100

document.body.style.setProperty("--body-height", `${contents.length * 100 + footer_height}vh`);


window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const windowHeight = window.innerHeight;

  contents.forEach((content, index) => {
    const start = index * windowHeight;
    const end = (index + 1) * windowHeight;
    const nextStart = (index - 1) * windowHeight;

    const tIn = (scrollTop - nextStart) / windowHeight; // how far into this section
    const tOut = (scrollTop - start) / windowHeight; // how far fading out

    if (scrollTop >= nextStart && scrollTop < start) {
      // incoming section (fade in)
      const t = Math.min(Math.max(tIn, 0), 1);
      content.style.opacity = t;
      content.style.visibility = 'visible';
      content.style.pointerEvents = 'auto';
      applyTransform(content, t, content.dataset.animation);
    } else if (scrollTop >= start && scrollTop < end) {
      // outgoing section (fade out)
      const t = Math.min(Math.max(tOut, 0), 1);
      content.style.opacity = 1 - t;
      content.style.visibility = 'visible';
      content.style.pointerEvents = 'auto';
      applyTransform(content, t, content.dataset.animation);
    } else {
      // hide
      content.style.opacity = 0;
      content.style.visibility = 'hidden';
      content.style.pointerEvents = 'none';
      content.style.transform = 'none';
    }
  });
});

function applyTransform(content, t, animation) {
  switch (animation) {
    case 'fade':
      content.style.transform = `scale(${1 + t * 0.05})`;
      break;
    case 'rotate':
      content.style.transform = `rotate(${t * 20}deg)`;
      break;
    case 'slide':
      content.style.transform = `translateX(${-t * 100}%)`;
      break;
    case 'zoom':
      content.style.transform = `scale(${1 + t * 0.3})`;
      break;
    default:
      content.style.transform = 'none';
  }
}



projects = document.getElementsByClassName("project_holder")


document.addEventListener("mousemove", (e) => {
  for (let proj of projects){
    rotateElement(e, proj)    
  };
});


function rotateElement(event, element) {
  const rect = element.getBoundingClientRect();
  const x = event.clientX;
  const y = event.clientY;
  const holderX = rect.left + rect.width / 2;
  const holderY = rect.top + rect.height / 2;

  //const holderX = window.innerWidth / 2;
  //const holderY = window.innerHeight / 2;

  let offsetX = ((x - holderX) / holderX);
  let offsetY = ((y - holderY) / holderY);

  if (offsetX < 2 && offsetY < 1) {
    const scaleMultiplier = element.matches(':hover') ? 10 : 1; // boost when scaled
    offsetX = offsetX * 10 * scaleMultiplier;
    offsetY = offsetY * 10 * scaleMultiplier;

    element.style.setProperty("--rotateX", -offsetY + "deg");
    element.style.setProperty("--rotateY", offsetX + "deg");
  } else {
    element.style.transition = 'transform 0.5s ease-out';
    element.style.setProperty("--rotateX", 0 + "deg");
    element.style.setProperty("--rotateY", 0 + "deg");
  }
}