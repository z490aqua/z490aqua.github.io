export interface Document {
  id: string;
  title: string;
  level: number;
  unlocked: boolean;
  content: string;
  power: {
    name: string;
    description: string;
  };
  icon: string;
}

export const documents: Document[] = [
  {
    id: "tutorial",
    title: "Game Tutorial",
    level: 0,
    unlocked: false,
    content: `Welcome to "The Balance of Power"!

In this educational game, you'll navigate through the challenges of the U.S. government's system of checks and balances. As you progress, you'll collect historical documents that grant you special powers to overcome obstacles.

CONTROLS:
- Use A/D or LEFT/RIGHT ARROW keys to move left and right
- Press SPACE to jump
- Collect documents to gain powers that help you overcome specific obstacles
- Complete each level by reaching the flag at the end

OBSTACLES:
You'll encounter three types of obstacles representing Executive Branch actions:
1. VETO: Red barriers that represent Presidential veto power. Requires Legislative powers to overcome.
2. EXECUTIVE ORDER: Blue barriers representing Executive Orders. Can be countered with certain Constitutional powers.
3. DECREE: Gold barriers symbolizing Presidential proclamations. Requires stronger Constitutional powers to neutralize.

THE BRANCHES OF GOVERNMENT:
Throughout the game, you'll encounter obstacles representing actions from different branches of government. Each historical document you collect will give you a unique power to counteract specific governmental actions, demonstrating how the system of checks and balances works in practice.

Good luck on your journey through American political history!`,
    power: {
      name: "Basic Movement",
      description: "You've learned the basic controls! Use A/D to move and SPACE to jump.",
    },
    icon: "tutorial",
  },
  {
    id: "constitution",
    title: "The Constitution",
    level: 1,
    unlocked: false,
    content: `We the People of the United States, in Order to form a more perfect Union, establish Justice, insure domestic Tranquility, provide for the common defence, promote the general Welfare, and secure the Blessings of Liberty to ourselves and our Posterity, do ordain and establish this Constitution for the United States of America.

Article I establishes the Legislative Branch (Congress) which consists of the House of Representatives and the Senate. It grants Congress various enumerated powers and the authority to make laws necessary and proper to carry out those powers.

The founders designed Congress to be the most powerful branch of government, with the ability to override presidential vetoes, impeach officials, and control the nation's finances.`,
    power: {
      name: "Bill Passage",
      description: "The Constitution grants the Legislative Branch the power to initiate and pass bills. Use this power to overcome Executive obstacles like Veto Shields.",
    },
    icon: "constitution",
  },
  {
    id: "federalist10",
    title: "Federalist No. 10",
    level: 2,
    unlocked: false,
    content: `Among the numerous advantages promised by a well-constructed Union, none deserves to be more accurately developed than its tendency to break and control the violence of faction.

By a faction, I understand a number of citizens, whether amounting to a majority or a minority of the whole, who are united and actuated by some common impulse of passion, or of interest, adversed to the rights of other citizens, or to the permanent and aggregate interests of the community.

The regulation of these various and interfering interests forms the principal task of modern legislation, and involves the spirit of party and faction in the necessary and ordinary operations of the government.`,
    power: {
      name: "Faction Control",
      description: "Federalist No. 10 explains how a republic controls factions. Use this power to navigate through multiple obstacles at once.",
    },
    icon: "federalist10",
  },
  {
    id: "federalist51",
    title: "Federalist No. 51",
    level: 2,
    unlocked: false,
    content: `If men were angels, no government would be necessary. If angels were to govern men, neither external nor internal controls on government would be necessary.

In framing a government which is to be administered by men over men, the great difficulty lies in this: you must first enable the government to control the governed; and in the next place oblige it to control itself.

Ambition must be made to counteract ambition. The interest of the man must be connected with the constitutional rights of the place.`,
    power: {
      name: "Checks & Balances",
      description: "Federalist No. 51 outlines the system of checks and balances. Use this power to temporarily disable Executive Branch obstacles.",
    },
    icon: "federalist51",
  },
  {
    id: "brutus1",
    title: "Brutus No. 1",
    level: 3,
    unlocked: false,
    content: `To the Citizens of the State of New-York.

When the public is called to investigate and decide upon a question in which not only the present members of the community are deeply interested, but upon which the happiness and misery of generations yet unborn is in great measure suspended, the benevolent mind cannot help feeling itself peculiarly interested in the result.

In this situation, I trust the feeble efforts of an individual, to lead the minds of the people to a wise and prudent determination, cannot fail of being acceptable to the candid and dispassionate part of the community.`,
    power: {
      name: "Anti-Federalist Resistance",
      description: "Brutus No. 1 critiques centralized power. Use this power to push back against large Executive obstacles.",
    },
    icon: "brutus1",
  },
  {
    id: "articles",
    title: "Articles of Confederation",
    level: 4,
    unlocked: false,
    content: `To all to whom these Presents shall come, we the undersigned Delegates of the States affixed to our Names send greeting.

Articles of Confederation and perpetual Union between the states of New Hampshire, Massachusetts-bay, Rhode Island and Providence Plantations, Connecticut, New York, New Jersey, Pennsylvania, Delaware, Maryland, Virginia, North Carolina, South Carolina and Georgia.

The said States hereby severally enter into a firm league of friendship with each other, for their common defense, the security of their liberties, and their mutual and general welfare, binding themselves to assist each other, against all force offered to, or attacks made upon them, or any of them, on account of religion, sovereignty, trade, or any other pretense whatever.`,
    power: {
      name: "State Cooperation",
      description: "The Articles of Confederation demonstrate the need for states to work together. Use this power to create temporary platforms.",
    },
    icon: "articles",
  },
  {
    id: "billrights",
    title: "The Bill of Rights",
    level: 5,
    unlocked: false,
    content: `THE Conventions of a number of the States, having at the time of their adopting the Constitution, expressed a desire, in order to prevent misconstruction or abuse of its powers, that further declaratory and restrictive clauses should be added: And as extending the ground of public confidence in the Government, will best ensure the beneficent ends of its institution.

RESOLVED by the Senate and House of Representatives of the United States of America, in Congress assembled, two thirds of both Houses concurring, that the following Articles be proposed to the Legislatures of the several States, as amendments to the Constitution of the United States.`,
    power: {
      name: "Civil Liberties",
      description: "The Bill of Rights protects individual freedoms. Use this power to gain temporary invincibility against Executive obstacles.",
    },
    icon: "billrights",
  },
  {
    id: "birmingham",
    title: "Letter from Birmingham Jail",
    level: 6,
    unlocked: false,
    content: `MY DEAR FELLOW CLERGYMEN:

While confined here in the Birmingham city jail, I came across your recent statement calling my present activities "unwise and untimely." Seldom do I pause to answer criticism of my work and ideas. If I sought to answer all the criticisms that cross my desk, my secretaries would have little time for anything other than such correspondence in the course of the day, and I would have no time for constructive work.

But since I feel that you are men of genuine good will and that your criticisms are sincerely set forth, I want to try to answer your statement in what I hope will be patient and reasonable terms.`,
    power: {
      name: "Moral Leadership",
      description: "The Letter from Birmingham Jail demonstrates moral leadership. Use this power to inspire temporary speed boosts.",
    },
    icon: "birmingham",
  },
  {
    id: "declaration",
    title: "The Declaration of Independence",
    level: 3,
    unlocked: false,
    content: `When in the Course of human events, it becomes necessary for one people to dissolve the political bands which have connected them with another, and to assume among the powers of the earth, the separate and equal station to which the Laws of Nature and of Nature's God entitle them, a decent respect to the opinions of mankind requires that they should declare the causes which impel them to the separation.

We hold these truths to be self-evident, that all men are created equal, that they are endowed by their Creator with certain unalienable Rights, that among these are Life, Liberty and the pursuit of Happiness.--That to secure these rights, Governments are instituted among Men, deriving their just powers from the consent of the governed.`,
    power: {
      name: "Independence",
      description: "The Declaration of Independence establishes the right to self-governance. Use this power to break through the strongest Executive obstacles.",
    },
    icon: "declaration",
  },
  {
    id: "federalist70",
    title: "Federalist No. 70",
    level: 5,
    unlocked: false,
    content: `There is an idea, which is not without its advocates, that a vigorous Executive is inconsistent with the genius of republican government. The enlightened well-wishers to this species of government must at least hope that the supposition is destitute of foundation; since they can never admit its truth, without at the same time admitting the condemnation of their own principles.

Energy in the Executive is a leading character in the definition of good government. It is essential to the protection of the community against foreign attacks; it is not less essential to the steady administration of the laws.`,
    power: {
      name: "Legislative Leadership",
      description: "Federalist No. 70 discusses executive energy. Use this power to increase your movement speed to counter Presidential obstacles.",
    },
    icon: "federalist70",
  }
];
