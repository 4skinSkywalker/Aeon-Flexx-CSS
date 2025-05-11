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

function initSelfTypingElements() {
  let outerExecCount = 0;
  let innerExecCount = 0;
  const documentObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        console.debug("Outer exec count:", ++outerExecCount);

        const selfTypingObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target._alreadySelfTyped) {
              console.debug("Inner exec count:", ++innerExecCount);
              
              entry.target._alreadySelfTyped = true;
              selfType(entry.target);
              selfTypingObserver.unobserve(entry.target);
            }
          });
        });

        entry.target.querySelectorAll(".self-type")
          .forEach(selfTypingEl => 
            selfTypingObserver.observe(selfTypingEl)
          );
      }
    });
  });

  documentObserver.observe(
    document.documentElement || document.body,
    { 
      attributes: false, 
      childList: true, 
      characterData: false 
    }
  );
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
