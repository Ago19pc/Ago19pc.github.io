


window.addEventListener('scroll', () => {
  const rotatingElement = document.getElementById('JINO');
  const scrollPosition = window.scrollY; // The vertical scroll position
  
  const rotationDegree = (scrollPosition % window.innerHeight) % 360; // This will rotate it with the scroll position
  const newHeight = scrollPosition * 0.5 + 'px'; // This will move the element up as we scroll down
  rotatingElement.style.transform = `translate(0%, ${newHeight}) rotate(${rotationDegree}deg)`;
});

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