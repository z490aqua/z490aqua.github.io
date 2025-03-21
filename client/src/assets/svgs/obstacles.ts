export function getObstacleSVG(type: string): string {
  switch (type) {
    case 'veto':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 45">
        <style>
          .veto-shield { fill: #8B0000; }
          .shield-accent { fill: #F0F0E8; }
          .shield-border { fill: #1A2E55; stroke: #1A2E55; stroke-width: 2; }
        </style>
        <path class="shield-border" d="M5,5 L55,5 L55,35 L30,40 L5,35 Z" />
        <path class="veto-shield" d="M8,8 L52,8 L52,32 L30,36 L8,32 Z" />
        <text x="30" y="26" text-anchor="middle" font-family="'Press Start 2P', cursive" font-size="14" fill="#F0F0E8">VETO</text>
      </svg>`;
      
    case 'executiveOrder':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 45">
        <style>
          .order-bg { fill: #00008B; }
          .paper { fill: #F0F0E8; }
          .text-line { fill: #1A2E55; }
          .seal { fill: #B22234; }
        </style>
        <rect class="order-bg" x="5" y="5" width="50" height="35" rx="2" />
        <rect class="paper" x="10" y="10" width="40" height="25" />
        <circle class="seal" cx="20" cy="20" r="6" />
        <rect class="text-line" x="32" y="15" width="14" height="2" />
        <rect class="text-line" x="32" y="20" width="14" height="2" />
        <rect class="text-line" x="15" y="30" width="30" height="2" />
      </svg>`;
      
    case 'presidentialDecree':
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 45">
        <style>
          .decree-bg { fill: #2F4F4F; }
          .decree-crown { fill: #B22234; }
          .decree-outline { fill: none; stroke: #F0F0E8; stroke-width: 2; }
        </style>
        <rect class="decree-bg" x="5" y="5" width="50" height="35" rx="4" />
        <path class="decree-crown" d="M15,25 L22,15 L30,25 L38,15 L45,25 L40,30 L20,30 Z" />
        <rect class="decree-outline" x="10" y="10" width="40" height="25" rx="2" />
      </svg>`;
      
    default:
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 45">
        <style>
          .obstacle-bg { fill: #4B0082; }
          .obstacle-text { fill: #F0F0E8; font-family: 'Press Start 2P', cursive; }
        </style>
        <rect class="obstacle-bg" x="5" y="5" width="50" height="35" rx="4" />
        <text x="30" y="28" class="obstacle-text" text-anchor="middle" font-size="16">!</text>
      </svg>`;
  }
}
