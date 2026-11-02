// The five-petal flower from favicon.svg, drawn inline so its outline follows the theme ink.

const PETAL_PATH = "M -4.75,-2.5 C -9.025,-6.5 -5.35,-11.5 0,-15.0 C 5.35,-11.5 9.025,-6.5 4.75,-2.5 C 2.09,0.5 -2.09,0.5 -4.75,-2.5 Z";
const VEIN_PATH = "M 0,-3.5 C 1.1,-7.5 0.6,-11.875 0,-13.7";
const PETAL_ANGLES = [-90, -18, 54, 126, 198];

const placeAt = (angle: number) => `rotate(${angle.toFixed(1)} 16 16) translate(16 16)`;

export function FlowerLogo() {
  return (
    <svg className="logo-mark" viewBox="0 0 32 32" aria-hidden="true">
      {PETAL_ANGLES.map((angle) => (
        <path key={`petal${angle}`} className="petal" d={PETAL_PATH} transform={placeAt(angle)} />
      ))}
      {PETAL_ANGLES.map((angle) => (
        <path key={`vein${angle}`} className="vein" d={VEIN_PATH} transform={placeAt(angle)} />
      ))}
      <circle className="heart" cx="16" cy="16" r="1.9" />
    </svg>
  );
}
