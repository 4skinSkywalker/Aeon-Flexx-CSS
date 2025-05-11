const SPECIAL_CHARS = "▄▓█▒□░▪■▫▀";
let specialCharIdx = 0;

function getNextSpecialChar() {
  specialCharIdx++;
  return SPECIAL_CHARS[specialCharIdx % SPECIAL_CHARS.length];
}

function selfType(element) {
  element.style.visibility = "visible";
  const speed = element.getAttribute("data-speed") || 25;
  const src = element.innerHTML;
  let srcIdx = 0;
  let dest = "";
  element.innerHTML = "⠀";
  
  const typer = () => {
    if (src.length + 1 === dest.length) {
      element.innerHTML = dest.slice(0, -1);
      return;
    }
    
    dest = (srcIdx === 0) ? dest : dest.slice(0, -1);
    dest += src[srcIdx] + getNextSpecialChar();
    srcIdx++;
    element.innerHTML = dest;
    setTimeout(typer, speed);
  };
  
  setTimeout(typer, 400);
}

function registerSelfTypeObserver() {
  const selfTypeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        selfType(entry.target);
        selfTypeObserver.unobserve(entry.target);
      }
    });
  });

  const registerSelfTypeElements = () =>
    [...document.querySelectorAll(".self-type")]
      .filter(element => !element._selfTypeRegistered)
      .forEach(element => {
        selfTypeObserver.observe(element);
        element._selfTypeRegistered = true;
      });
  registerSelfTypeElements();

  const documentObserver = new MutationObserver(mutations => {
    for (const mutation of mutations) {
      if (mutation.target._selfTypeRegistered) {
        continue;
      }
      registerSelfTypeElements();
    }
  });

  documentObserver.observe(document.body, { subtree: true, childList: true });
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
  registerSelfTypeObserver();
  makeElementsClickableWithSpace();
})();
