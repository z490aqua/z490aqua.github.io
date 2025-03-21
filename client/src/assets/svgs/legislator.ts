export function getLegislatorSVG(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 64">
    <style>
      .legislator { fill: #B22234; }
      .accent { fill: #F0F0E8; }
      .outline { fill: #1A2E55; }
    </style>
    <rect class="outline" x="10" y="4" width="28" height="24" />
    <rect class="legislator" x="12" y="6" width="24" height="20" />
    <rect class="accent" x="18" y="10" width="12" height="4" />
    <rect class="accent" x="16" y="16" width="16" height="2" />
    <rect class="outline" x="14" y="28" width="20" height="30" />
    <rect class="legislator" x="16" y="30" width="16" height="26" />
    <rect class="outline" x="6" y="38" width="8" height="20" />
    <rect class="legislator" x="8" y="40" width="4" height="16" />
    <rect class="outline" x="34" y="38" width="8" height="20" />
    <rect class="legislator" x="36" y="40" width="4" height="16" />
    <rect class="outline" x="14" y="58" width="8" height="6" />
    <rect class="legislator" x="16" y="60" width="4" height="2" />
    <rect class="outline" x="26" y="58" width="8" height="6" />
    <rect class="legislator" x="28" y="60" width="4" height="2" />
  </svg>`;
}
