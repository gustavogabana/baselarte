// The AWS note's interactive parts: flashcards, architecture explorer, SSH stepper, load balancer,
// Organizations tree, security group simulator and CIDR calculator. Loaded only on that page.
// Everything works without animation; Motion only adds it when the visitor allows motion.
import { animate, inView, stagger, type DOMKeyframesDefinition, type AnimationOptions } from "motion";

const SSH_AUTOPLAY_STEP_MS = 2200;
// Network and subnet maths for the CIDR calculator: AWS reserves 5 addresses per subnet.
const IPV4_ADDRESS_BITS = 32;
const AWS_RESERVED_ADDRESSES_PER_SUBNET = 5;
// Inbound rules of the EC2 security group used by the simulator.
const SECURITY_GROUP_INBOUND_RULES = [
  { port: "3000", source: "lb" },
  { port: "22", source: "me" },
];

const animationsEnabled = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function findOne<T extends Element = HTMLElement>(selector: string, scope: ParentNode = document): T {
  const element = scope.querySelector<T>(selector);
  if (!element) throw new Error(`The AWS note is missing "${selector}".`);
  return element;
}

function findAll<T extends Element = HTMLElement>(selector: string, scope: ParentNode = document): T[] {
  return [...scope.querySelectorAll<T>(selector)];
}

function bilingual(portuguese: string, english: string): string {
  return `<span class="pt">${portuguese}</span><span class="en">${english}</span>`;
}

function icon(name: "check" | "ban"): string {
  return `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
}

function centerOf(element: Element, container: Element) {
  const containerBox = container.getBoundingClientRect();
  const elementBox = element.getBoundingClientRect();
  return {
    x: elementBox.left - containerBox.left + elementBox.width / 2,
    y: elementBox.top - containerBox.top + elementBox.height / 2,
  };
}

function animateIfEnabled(target: Element | Element[], keyframes: DOMKeyframesDefinition, options?: AnimationOptions) {
  return animationsEnabled ? animate(target, keyframes, options) : null;
}

/* Reveal topics and cards as they scroll into view. */
function revealOnScroll(): void {
  if (!animationsEnabled) return;
  const revealTargets = ".topic > *";
  findAll(`${revealTargets}, .grid .card`).forEach((element) => (element.style.opacity = "0"));
  inView(
    revealTargets,
    (revealedElement) => {
      animate(revealedElement, { opacity: [0, 1], y: [24, 0] }, { duration: 0.6, ease: "easeOut" });
    },
    { margin: "0px 0px -8% 0px" },
  );
  findAll(".grid").forEach((cardGrid) =>
    inView(cardGrid, () => {
      animate(findAll(".card", cardGrid), { opacity: [0, 1], y: [20, 0] }, { delay: stagger(0.08), duration: 0.5 });
    }),
  );
}

function setUpFlashcards(): void {
  findAll<HTMLDetailsElement>("details.fc").forEach((flashcard) =>
    flashcard.addEventListener("toggle", () => {
      if (flashcard.open) animateIfEnabled(findOne(".ans", flashcard), { opacity: [0, 1], y: [-6, 0] }, { duration: 0.3 });
    }),
  );
}

function setUpArchitectureExplorers(): void {
  findAll("[data-explorer]").forEach((explorer) => {
    const nodeButtons = findAll<HTMLButtonElement>("button.node", explorer);
    const panels = findAll(".panel > div", explorer);

    function showPanel(panelId: string | undefined) {
      nodeButtons.forEach((nodeButton) => nodeButton.setAttribute("aria-pressed", String(nodeButton.dataset.t === panelId)));
      panels.forEach((panel) => {
        const isSelected = panel.id === panelId;
        panel.hidden = !isSelected;
        if (isSelected) animateIfEnabled(panel, { opacity: [0, 1], x: [-12, 0] }, { duration: 0.35 });
      });
    }

    nodeButtons.forEach((nodeButton) => nodeButton.addEventListener("click", () => showPanel(nodeButton.dataset.t)));
    showPanel(nodeButtons[0]?.dataset.t);
  });
}

function setUpSshSteppers(): void {
  findAll("[data-stepper]").forEach((stepper) => {
    const stepItems = findAll(".steps li", stepper);
    const stage = findOne(".stage", stepper);
    const packetDot = findOne(".dot", stepper);
    const clientNode = findOne(".c", stepper);
    const serverNode = findOne(".s", stepper);
    const playButton = findOne(".play", stepper);
    let currentStep = 0;
    let autoplayTimer: ReturnType<typeof setInterval> | undefined;

    function renderStep() {
      stepItems.forEach((stepItem, stepIndex) => stepItem.classList.toggle("on", stepIndex === currentStep));
      const step = stepItems[currentStep];
      if (!step) return;
      stage.classList.toggle("enc", step.dataset.enc === "1");
      if (!animationsEnabled) return;

      const clientCenter = centerOf(clientNode, stage);
      const serverCenter = centerOf(serverNode, stage);
      const direction = step.dataset.dir;
      if (direction === "none") {
        animate(clientNode, { scale: [1, 1.12, 1] }, { duration: 0.5 });
        return;
      }
      const horizontalPath =
        direction === "c2s" ? [clientCenter.x, serverCenter.x]
        : direction === "s2c" ? [serverCenter.x, clientCenter.x]
        : [clientCenter.x, serverCenter.x, clientCenter.x];
      animate(packetDot, { x: horizontalPath, y: horizontalPath.map(() => clientCenter.y), opacity: 1 }, { duration: 1.1, ease: "easeInOut" })
        .then(() => animate(packetDot, { opacity: 0 }, { duration: 0.2 }));
    }

    function moveBy(offset: number) {
      currentStep = (currentStep + offset + stepItems.length) % stepItems.length;
      renderStep();
    }

    function stopAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = undefined;
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
    stepItems.forEach((stepItem, stepIndex) =>
      stepItem.addEventListener("click", () => {
        currentStep = stepIndex;
        renderStep();
      }),
    );
    stepItems[0]?.classList.add("on");
  });
}

/* Load balancer demo: round robin across healthy targets. */
function setUpLoadBalancerDemos(): void {
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
      const chosenTarget = healthyTargets[nextTargetIndex++ % healthyTargets.length];
      if (!chosenTarget) {
        output.innerHTML = bilingual("Nenhum destino saudável: erro 503.", "No healthy target: 503 error.");
        return;
      }
      targets.forEach((target) => target.classList.remove("hit"));
      requestInFlight = true;
      if (animationsEnabled) {
        const userCenter = centerOf(userNode, demo);
        const balancerCenter = centerOf(balancerNode, demo);
        const targetCenter = centerOf(chosenTarget, demo);
        await animate(
          packet,
          { x: [userCenter.x, balancerCenter.x, targetCenter.x], y: [userCenter.y, balancerCenter.y, targetCenter.y], opacity: [1, 1, 1] },
          { duration: 1.3, ease: "easeInOut" },
        );
        animate(packet, { opacity: 0 }, { duration: 0.2 });
        animate(chosenTarget, { scale: [1, 1.06, 1] }, { duration: 0.4 });
      }
      chosenTarget.classList.add("hit");
      const targetName = chosenTarget.dataset.name ?? "";
      output.innerHTML = bilingual(`Requisição enviada para <b>${targetName}</b>.`, `Request sent to <b>${targetName}</b>.`);
      requestInFlight = false;
    });
  });
}

/* Organizations tree: the effective service control policies of the chosen node. */
function setUpOrganizationTrees(): void {
  findAll("[data-org]").forEach((organization) => {
    const nodeButtons = findAll<HTMLButtonElement>("button.node", organization);
    const policyChips = findAll(".chip", organization);
    const exemptNote = findOne(".org-note", organization);
    const nodesById = new Map(nodeButtons.map((nodeButton) => [nodeButton.id, nodeButton]));

    function selectNode(selectedNode: HTMLButtonElement) {
      nodeButtons.forEach((nodeButton) => nodeButton.setAttribute("aria-pressed", String(nodeButton === selectedNode)));
      // Policies are inherited: walk up through the parents and collect every attached policy.
      const effectivePolicies = new Set<string>();
      for (let node: HTMLButtonElement | undefined = selectedNode; node; node = nodesById.get(node.dataset.parent ?? "")) {
        (node.dataset.scp ?? "").split(" ").filter(Boolean).forEach((policyId) => effectivePolicies.add(policyId));
      }
      const isExempt = Boolean(selectedNode.dataset.exempt);
      policyChips.forEach((chip) => chip.classList.toggle("on", effectivePolicies.has(chip.dataset.id ?? "") && !isExempt));
      exemptNote.hidden = !isExempt;
      animateIfEnabled(findOne(".chips", organization), { opacity: [0.3, 1] }, { duration: 0.4 });
      if (!isExempt) animateIfEnabled(findAll(".chip.on", organization), { scale: [0.85, 1] }, { delay: stagger(0.07), duration: 0.35 });
    }

    nodeButtons.forEach((nodeButton) => nodeButton.addEventListener("click", () => selectNode(nodeButton)));
    if (nodeButtons[0]) selectNode(nodeButtons[0]);
  });
}

function setUpSecurityGroupSimulators(): void {
  findAll("[data-sg]").forEach((simulator) => {
    const sourceSelect = findOne<HTMLSelectElement>(".sg-source", simulator);
    const portSelect = findOne<HTMLSelectElement>(".port", simulator);
    const output = findOne(".sg-out", simulator);

    function evaluate() {
      const isAllowed = SECURITY_GROUP_INBOUND_RULES.some((rule) => rule.port === portSelect.value && rule.source === sourceSelect.value);
      output.className = `result sg-out ${isAllowed ? "ok" : "no"}`;
      output.innerHTML = isAllowed
        ? bilingual(
            `${icon("check")} Permitido. Como o SG é stateful, a resposta volta sozinha, sem regra outbound.`,
            `${icon("check")} Allowed. SGs are stateful, so the reply goes back on its own, no outbound rule needed.`,
          )
        : bilingual(
            `${icon("ban")} Bloqueado. Nenhuma regra inbound libera essa origem nessa porta (tudo é negado por padrão).`,
            `${icon("ban")} Blocked. No inbound rule allows this source on this port (everything is denied by default).`,
          );
      animateIfEnabled(output, { opacity: [0, 1], x: [-10, 0] }, { duration: 0.3 });
    }

    sourceSelect.addEventListener("change", evaluate);
    portSelect.addEventListener("change", evaluate);
    evaluate();
  });
}

function setUpCidrCalculators(): void {
  findAll("[data-cidr]").forEach((calculator) => {
    const prefixSlider = findOne<HTMLInputElement>("input", calculator);
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
}

revealOnScroll();
setUpFlashcards();
setUpArchitectureExplorers();
setUpSshSteppers();
setUpLoadBalancerDemos();
setUpOrganizationTrees();
setUpSecurityGroupSimulators();
setUpCidrCalculators();
