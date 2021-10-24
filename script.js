/************************************************************************************************
 *                                                                                              *
 *                              VARIABLES DECLARATION                                           *
 *                                                                                              *
 ************************************************************************************************/
const state = {
  clicked: 0,
  isVisible: true,
  Percentage: 0,
  lastViewStarted: 0,
  viewabilityTime: 0,
  adIsViewable: false,
};

const elements = {
  viewable: document.getElementById('viewable'),
  time: document.getElementById('time'),
  percentage: document.getElementById('percentage'),
  clicked: document.getElementById('clicked'),
  ad: document.getElementById('ad'),
};

/**
 * Logs the viewability values in the console
 *
 * @override
 */
window.log = function () {
  console.log(
    '%c -------------------------------------------- ',
    'background: green; color: green'
  );

  console.log(`Ad is viewable: ${state.adIsViewable}`);
  console.log(`Viewability time of the ad in sec: ${timeCalculator()}`);
  console.log(
    `Viewabile percentage: ${Number.parseFloat(state.Percentage * 100).toFixed(
      1
    )}%`
  );
  console.log(`Clicked ${state.clicked} times.`);

  console.log(
    '%c -------------------------------------------- ',
    'background: green; color: green'
  );

  elements.viewable.innerText = `Ad is viewable: ${state.adIsViewable}`;
  elements.time.innerText = `Viewability time of the ad in sec: ${timeCalculator()}`;
  elements.percentage.innerText = `Viewabile percentage: ${Number.parseFloat(
    state.Percentage * 100
  ).toFixed(2)}%`;
  elements.clicked.innerText = `Clicked ${state.clicked} times.`;

  state.adIsViewable && state.isVisible && updateTimer();
};

/************************************************************************************************
 *                                                                                              *
 *                              YOUR IMPLEMENTATION                                             *
 *                                                                                              *
 ************************************************************************************************/
let hidden, visibilityChange;
if (typeof document.hidden !== 'undefined') {
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}
const timeCalculator = () => Math.floor(state.viewabilityTime / 1000);

const onAdHandler = () => {
  state.clicked += 1;
};

elements.ad.addEventListener('click', onAdHandler);

const onVisibilityChange = () => {
  const isVisible = !document.hidden && document.visibilityState === 'visible';
  state.isVisible = isVisible;

  if (isVisible) {
    state.lastViewStarted = performance.now();
  } else {
    updateTimer();
    state.lastViewStarted = 0;
  }
};

document.addEventListener(visibilityChange, onVisibilityChange, false);

const options = {
  root: null,
  rootMargin: '0px',
  threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
};
const cb = (entries) => {
  const entry = entries[0];
  if (entry.isIntersecting) {
    state.lastViewStarted = entry.time;
    state.Percentage = entry.intersectionRatio;
    state.adIsViewable = true;
    updateTimer();
  } else {
    state.lastViewStarted = 0;
    state.adIsViewable = false;
    state.Percentage = 0;
    updateTimer();
  }
};

const observer = new IntersectionObserver(cb, options);

observer.observe(elements.ad);

const updateTimer = () => {
  const currentTime = performance.now();
  if (state.lastViewStarted) {
    const offset = currentTime - state.lastViewStarted;
    state.viewabilityTime = parseFloat(state.viewabilityTime) + offset;
  }

  state.lastViewStarted = currentTime;
};
