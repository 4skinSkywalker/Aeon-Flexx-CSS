const SPECIAL_CHARS = "▄▓█▒□░▪■▫▀";
let specialCharIdx = 0;

function getNextSpecialChar() {
  specialCharIdx++;
  return SPECIAL_CHARS[specialCharIdx % SPECIAL_CHARS.length];
}

function selfType(element) {
  const speed = element.getAttribute("data-speed") || 25;
  const src = element.innerText;
  let srcIdx = 0;
  let dest = "";
  element.innerText = "⠀";
  
  const typer = () => {
    if (src.length + 1 === dest.length) {
      element.innerText = dest.slice(0, -1);
      return;
    }
    
    dest = (srcIdx === 0) ? dest : dest.slice(0, -1);
    dest += src[srcIdx] + getNextSpecialChar();
    srcIdx++;
    element.innerText = dest;
    setTimeout(typer, speed);
  };
  
  setTimeout(typer, 400);
}

function initSelfTypingElements() {
  const els = document.querySelectorAll(".self-type");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        selfType(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });
  els.forEach(el => observer.observe(el));
}

function makeElementsClickableWithSpace() {
  [
    ...document.querySelectorAll("label"),
    ...document.querySelectorAll("a.btn")
  ].forEach(label => {
    label.addEventListener("keydown", function(event) {
      if (event.keyCode === 32 || event.key === " ") {
          event.preventDefault();
          this.click();
      }
    });
  })
}

(function () {
  initSelfTypingElements();
  makeElementsClickableWithSpace();
})();
