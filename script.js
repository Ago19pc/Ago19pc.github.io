

window.addEventListener('scroll', () => {
    const rotatingElement = document.getElementById('JINO');
    const scrollPosition = window.scrollY; // The vertical scroll position
    
    
        

    const rotationDegree = (scrollPosition % window.innerHeight) % 360; // This will rotate it with the scroll position
    const newHeight = scrollPosition * 0.5 + 'px'; // This will move the element up as we scroll down
    rotatingElement.style.transform = `translate(0%, ${newHeight}) rotate(${rotationDegree}deg)`;
  });