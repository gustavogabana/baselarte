// Baselarte — AWS Notes interactions (copy buttons, scroll spy, simulators) with Motion.
// Theme, language and the footer clock are handled by boot.js, i18n.js and main.js.

// Keep in sync with MOTION_MODULE_URL in ../main.js.
const MOTION_MODULE_URL = "https://cdn.jsdelivr.net/npm/motion@14.0.0/+esm";
const COPY_LABEL = "copy";
const COPIED_LABEL = "✓";
const COPIED_LABEL_MS = 1200;
const SSH_AUTOPLAY_STEP_MS = 2200;
// Network and subnet maths for the CIDR calculator: AWS reserves 5 addresses per subnet.
const IPV4_ADDRESS_BITS = 32;
const AWS_RESERVED_ADDRESSES_PER_SUBNET = 5;
// A section counts as "current" while it crosses this band of the viewport.
const SCROLL_SPY_ROOT_MARGIN = "-20% 0px -70% 0px";

// Inbound rules of the EC2 security group used by the simulator.
const SECURITY_GROUP_INBOUND_RULES = [
  { port: "3000", source: "lb" },
  { port: "22", source: "me" },
];

function findOne(selector, scope = document) {
  return scope.querySelector(selector);
}

function findAll(selector, scope = document) {
  return [...scope.querySelectorAll(selector)];
}

function bilingual(portuguese, english) {
  return `<span class="pt">${portuguese}</span><span class="en">${english}</span>`;
}

function icon(name) {
  return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function centerOf(element, container) {
  const containerBox = container.getBoundingClientRect();
  const elementBox = element.getBoundingClientRect();
  return {
    x: elementBox.left - containerBox.left + elementBox.width / 2,
    y: elementBox.top - containerBox.top + elementBox.height / 2,
  };
}

/* --------------------------------------------------------------------------
   Sections menu (small screens)
   -------------------------------------------------------------------------- */

const sectionsToggle = findOne("[data-sections-toggle]");
const sectionsNav = findOne("#sections-nav");

function setSectionsMenuOpen(isOpen) {
  sectionsNav.classList.toggle("open", isOpen);
  sectionsToggle.setAttribute("aria-expanded", String(isOpen));
}

sectionsToggle.addEventListener("click", () => {
  setSectionsMenuOpen(!sectionsNav.classList.contains("open"));
});
findAll("a", sectionsNav).forEach((sectionLink) => {
  sectionLink.addEventListener("click", () => setSectionsMenuOpen(false));
});

/* --------------------------------------------------------------------------
   Copy buttons on code blocks
   -------------------------------------------------------------------------- */

findAll("pre").forEach((codeBlock) => {
  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.className = "copy";
  copyButton.textContent = COPY_LABEL;
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(findOne("code", codeBlock).innerText);
      copyButton.textContent = COPIED_LABEL;
      setTimeout(() => (copyButton.textContent = COPY_LABEL), COPIED_LABEL_MS);
    } catch (clipboardError) {
      // Clipboard access can be denied (insecure context or permissions); the code stays selectable.
      console.warn("Could not copy the code to the clipboard.", clipboardError);
    }
  });
  codeBlock.appendChild(copyButton);
});

/* --------------------------------------------------------------------------
   Motion (optional): the page works fully without it.
   -------------------------------------------------------------------------- */

let motion = null;
try {
  motion = await import(MOTION_MODULE_URL);
} catch (motionLoadError) {
  console.warn("Motion failed to load; running without animations.", motionLoadError);
}

const { animate, inView, scroll, stagger } = motion ?? {};
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const animationsEnabled = Boolean(motion) && !prefersReducedMotion;

function animateIfEnabled(element, keyframes, options) {
  return animationsEnabled && element ? animate(element, keyframes, options) : null;
}

const scrollProgressBar = findOne("#scroll-progress");

if (animationsEnabled) {
  scroll(animate(scrollProgressBar, { scaleX: [0, 1] }, { ease: "linear" }));

  const revealTargets = ".topic > *";
  findAll(`${revealTargets}, .grid .card`).forEach((element) => (element.style.opacity = 0));
  inView(revealTargets, (revealedElement) => {
    animate(revealedElement, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, ease: "easeOut" });
  }, { margin: "0px 0px -8% 0px" });
  findAll(".grid").forEach((cardGrid) =>
    inView(cardGrid, () => {
      animate(findAll(".card", cardGrid), { opacity: [0, 1], y: [20, 0] }, { delay: stagger(0.08), duration: 0.5 });
    })
  );
} else {
  scrollProgressBar.style.display = "none";
}

/* --------------------------------------------------------------------------
   Scroll spy: highlight the section being read in the sections list
   -------------------------------------------------------------------------- */

const sectionLinks = new Map(
  findAll("a", sectionsNav).map((sectionLink) => [sectionLink.getAttribute("href").slice(1), sectionLink])
);
const scrollSpy = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    sectionLinks.forEach((sectionLink) => sectionLink.classList.remove("active"));
    sectionLinks.get(entry.target.id)?.classList.add("active");
  }),
  { rootMargin: SCROLL_SPY_ROOT_MARGIN }
);
findAll(".topic").forEach((topicSection) => scrollSpy.observe(topicSection));

/* --------------------------------------------------------------------------
   Flashcards
   -------------------------------------------------------------------------- */

findAll("details.fc").forEach((flashcard) =>
  flashcard.addEventListener("toggle", () => {
    if (flashcard.open) animateIfEnabled(findOne(".ans", flashcard), { opacity: [0, 1], y: [-6, 0] }, { duration: 0.3 });
  })
);

/* --------------------------------------------------------------------------
   Architecture explorer
   -------------------------------------------------------------------------- */

findAll("[data-explorer]").forEach((explorer) => {
  const nodeButtons = findAll("button.node", explorer);
  const panels = findAll(".panel > div", explorer);

  function showPanel(panelId) {
    nodeButtons.forEach((nodeButton) => nodeButton.setAttribute("aria-pressed", nodeButton.dataset.t === panelId));
    panels.forEach((panel) => {
      const isSelected = panel.id === panelId;
      panel.hidden = !isSelected;
      if (isSelected) animateIfEnabled(panel, { opacity: [0, 1], x: [-12, 0] }, { duration: 0.35 });
    });
  }

  nodeButtons.forEach((nodeButton) => nodeButton.addEventListener("click", () => showPanel(nodeButton.dataset.t)));
  showPanel(nodeButtons[0].dataset.t);
});

/* --------------------------------------------------------------------------
   SSH handshake stepper
   -------------------------------------------------------------------------- */

findAll("[data-stepper]").forEach((stepper) => {
  const stepItems = findAll(".steps li", stepper);
  const stage = findOne(".stage", stepper);
  const packetDot = findOne(".dot", stepper);
  const clientNode = findOne(".c", stepper);
  const serverNode = findOne(".s", stepper);
  const playButton = findOne(".play", stepper);
  let currentStep = 0;
  let autoplayTimer = null;

  function renderStep() {
    stepItems.forEach((stepItem, stepIndex) => stepItem.classList.toggle("on", stepIndex === currentStep));
    const step = stepItems[currentStep];
    stage.classList.toggle("enc", step.dataset.enc === "1");
    if (!animationsEnabled) return;

    const clientCenter = centerOf(clientNode, stage);
    const serverCenter = centerOf(serverNode, stage);
    const direction = step.dataset.dir;
    if (direction === "none") {
      animate(clientNode, { scale: [1, 1.12, 1] }, { duration: 0.5 });
      return;
    }
    const horizontalPath = direction === "c2s" ? [clientCenter.x, serverCenter.x]
      : direction === "s2c" ? [serverCenter.x, clientCenter.x]
      : [clientCenter.x, serverCenter.x, clientCenter.x];
    animate(packetDot, { x: horizontalPath, y: horizontalPath.map(() => clientCenter.y), opacity: 1 }, { duration: 1.1, ease: "easeInOut" })
      .then(() => animate(packetDot, { opacity: 0 }, { duration: 0.2 }));
  }

  function moveBy(offset) {
    currentStep = (currentStep + offset + stepItems.length) % stepItems.length;
    renderStep();
  }

  function stopAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = null;
    playButton.dataset.on = "";
  }

  findOne(".prev", stepper).addEventListener("click", () => moveBy(-1));
  findOne(".next", stepper).addEventListener("click", () => moveBy(1));
  playButton.addEventListener("click", () => {
    if (autoplayTimer) {
      stopAutoplay();
      return;
    }
    playButton.dataset.on = "1";
    currentStep = stepItems.length - 1;
    moveBy(1);
    autoplayTimer = setInterval(() => {
      if (currentStep === stepItems.length - 1) stopAutoplay();
      else moveBy(1);
    }, SSH_AUTOPLAY_STEP_MS);
  });
  stepItems.forEach((stepItem, stepIndex) => stepItem.addEventListener("click", () => {
    currentStep = stepIndex;
    renderStep();
  }));
  stepItems[0].classList.add("on");
});

/* --------------------------------------------------------------------------
   Load balancer demo (round robin across healthy targets)
   -------------------------------------------------------------------------- */

findAll("[data-lb]").forEach((demo) => {
  const userNode = findOne(".user", demo);
  const balancerNode = findOne(".lb", demo);
  const packet = findOne(".pkt", demo);
  const output = findOne(".lb-out", demo);
  const targets = findAll(".targets .node", demo);
  let nextTargetIndex = 0;
  let requestInFlight = false;

  targets.forEach((target) => {
    findOne("button", target).addEventListener("click", () => target.classList.toggle("down"));
  });

  findOne(".send", demo).addEventListener("click", async () => {
    if (requestInFlight) return;
    const healthyTargets = targets.filter((target) => !target.classList.contains("down"));
    if (!healthyTargets.length) {
      output.innerHTML = bilingual("Nenhum destino saudável: erro 503.", "No healthy target: 503 error.");
      return;
    }
    const chosenTarget = healthyTargets[nextTargetIndex++ % healthyTargets.length];
    targets.forEach((target) => target.classList.remove("hit"));
    requestInFlight = true;
    if (animationsEnabled) {
      const userCenter = centerOf(userNode, demo);
      const balancerCenter = centerOf(balancerNode, demo);
      const targetCenter = centerOf(chosenTarget, demo);
      await animate(packet, {
        x: [userCenter.x, balancerCenter.x, targetCenter.x],
        y: [userCenter.y, balancerCenter.y, targetCenter.y],
        opacity: [1, 1, 1],
      }, { duration: 1.3, ease: "easeInOut" });
      animate(packet, { opacity: 0 }, { duration: 0.2 });
      animate(chosenTarget, { scale: [1, 1.06, 1] }, { duration: 0.4 });
    }
    chosenTarget.classList.add("hit");
    const targetName = chosenTarget.dataset.name;
    output.innerHTML = bilingual(`Requisição enviada para <b>${targetName}</b>.`, `Request sent to <b>${targetName}</b>.`);
    requestInFlight = false;
  });
});

/* --------------------------------------------------------------------------
   Organizations tree: effective service control policies of the chosen node
   -------------------------------------------------------------------------- */

findAll("[data-org]").forEach((organization) => {
  const nodeButtons = findAll("button.node", organization);
  const policyChips = findAll(".chip", organization);
  const exemptNote = findOne(".org-note", organization);
  const nodesById = Object.fromEntries(nodeButtons.map((nodeButton) => [nodeButton.id, nodeButton]));

  function selectNode(selectedNode) {
    nodeButtons.forEach((nodeButton) => nodeButton.setAttribute("aria-pressed", nodeButton === selectedNode));
    // Policies are inherited: walk up through the parents and collect every attached policy.
    const effectivePolicies = new Set();
    for (let node = selectedNode; node; node = nodesById[node.dataset.parent]) {
      (node.dataset.scp || "").split(" ").filter(Boolean).forEach((policyId) => effectivePolicies.add(policyId));
    }
    const isExempt = Boolean(selectedNode.dataset.exempt);
    policyChips.forEach((chip) => chip.classList.toggle("on", effectivePolicies.has(chip.dataset.id) && !isExempt));
    exemptNote.hidden = !isExempt;
    animateIfEnabled(findOne(".chips", organization), { opacity: [0.3, 1] }, { duration: 0.4 });
    if (animationsEnabled && !isExempt) {
      animate(findAll(".chip.on", organization), { scale: [0.85, 1] }, { delay: stagger(0.07), duration: 0.35 });
    }
  }

  nodeButtons.forEach((nodeButton) => nodeButton.addEventListener("click", () => selectNode(nodeButton)));
  selectNode(nodeButtons[0]);
});

/* --------------------------------------------------------------------------
   Security group simulator
   -------------------------------------------------------------------------- */

findAll("[data-sg]").forEach((simulator) => {
  const sourceSelect = findOne(".sg-source", simulator);
  const portSelect = findOne(".port", simulator);
  const output = findOne(".sg-out", simulator);

  function evaluate() {
    const isAllowed = SECURITY_GROUP_INBOUND_RULES.some(
      (rule) => rule.port === portSelect.value && rule.source === sourceSelect.value
    );
    output.className = `result sg-out ${isAllowed ? "ok" : "no"}`;
    output.innerHTML = isAllowed
      ? bilingual(
        `${icon("check")} Permitido. Como o SG é stateful, a resposta volta sozinha, sem regra outbound.`,
        `${icon("check")} Allowed. SGs are stateful, so the reply goes back on its own, no outbound rule needed.`
      )
      : bilingual(
        `${icon("ban")} Bloqueado. Nenhuma regra inbound libera essa origem nessa porta (tudo é negado por padrão).`,
        `${icon("ban")} Blocked. No inbound rule allows this source on this port (everything is denied by default).`
      );
    animateIfEnabled(output, { opacity: [0, 1], x: [-10, 0] }, { duration: 0.3 });
  }

  sourceSelect.addEventListener("change", evaluate);
  portSelect.addEventListener("change", evaluate);
  evaluate();
});

/* --------------------------------------------------------------------------
   CIDR calculator
   -------------------------------------------------------------------------- */

findAll("[data-cidr]").forEach((calculator) => {
  const prefixSlider = findOne("input", calculator);
  const prefixLabel = findOne(".cidr-n", calculator);
  const totalLabel = findOne(".cidr-total", calculator);
  const usableLabel = findOne(".cidr-usable", calculator);
  let displayedTotal = 0;

  function render() {
    const prefixLength = Number(prefixSlider.value);
    const totalAddresses = 2 ** (IPV4_ADDRESS_BITS - prefixLength);
    prefixLabel.textContent = `/${prefixLength}`;
    usableLabel.textContent = Math.max(totalAddresses - AWS_RESERVED_ADDRESSES_PER_SUBNET, 0).toLocaleString();

    const startingTotal = displayedTotal;
    displayedTotal = totalAddresses;
    if (animationsEnabled) {
      animate(startingTotal, totalAddresses, {
        duration: 0.4,
        onUpdate: (value) => (totalLabel.textContent = Math.round(value).toLocaleString()),
      });
    } else {
      totalLabel.textContent = totalAddresses.toLocaleString();
    }
  }

  prefixSlider.addEventListener("input", render);
  render();
});
