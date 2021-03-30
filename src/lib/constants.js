import { isDevelopment } from './flags';

const CHECK_BLOCK_EVERY_MS = isDevelopment ? 1000 : 10000;
const DEFAULT_GAS_PRICE_GWEI = 40;
const MAX_GAS_PRICE_GWEI = 400;

const MIN_GALAXY = 0;
const MAX_GALAXY = 255;
const MIN_STAR = 256;
const MAX_STAR = 65535;
const MIN_PLANET = 65536;
const MAX_PLANET = 4294967297;

const ZOD = MIN_GALAXY;

const PLANET_ENTROPY_BITS = 64;
const STAR_ENTROPY_BITS = 128;
const GALAXY_ENTROPY_BITS = 384;

const SEED_ENTROPY_BITS = 128;

//TODO move into azimuth-js
const GAS_LIMITS = {
  SPAWN: 250000,
  TRANSFER: 560000, //NOTE biggest, also update gas tank's max
  CONFIGURE_KEYS: 100000,
  SET_PROXY: 150000,
  //
  ESCAPE: 115000, //NOTE low sample size
  ADOPT: 100000, //NOTE low sample size
  CANCEL_ESCAPE: 200000, //NOTE no samples
  REJECT: 200000, //NOTE no samples
  DETACH: 200000, //NOTE no samples
  //
  GIFT_PLANET: 450000, //NOTE low sample size, //NOTE also update in gas tank
  //
  TRANSFER_LOCKUP: 200000, //NOTE no samples
  //
  SEND_ETH: 21000,
  //
  DEFAULT: 550000,
};

// TODO: this is walletgen-ui specific, move into a wallet router later
const GEN_STATES = {
  ENY_NOSTART: Symbol('ENY_NOSTART'),
  ENY_PENDING: Symbol('ENY_PENDING'),
  ENY_SUCCESS: Symbol('ENY_SUCCESS'),
  ENY_FAILURE: Symbol('ENY_FAILURE'),
  DERIVATION_NOSTART: Symbol('DERIVATION_NOSTART'),
  DERIVATION_PENDING: Symbol('DERIVATION_PENDING'),
  DERIVATION_SUCCESS: Symbol('DERIVATION_SUCCESS'),
  DERIVATION_FAILURE: Symbol('DERIVATION_FAILURE'),
  PAPER_NOSTART: Symbol('PAPER_NOSTART'),
  PAPER_PENDING: Symbol('PAPER_PENDING'),
  PAPER_SUCCESS: Symbol('PAPER_SUCCESS'),
  PAPER_FAILURE: Symbol('PAPER_FAILURE'),
};

const BUTTON_STATES = {
  NOSTART: Symbol('NOSTART'),
  SUCCESS: Symbol('SUCCESS'),
  ERROR: Symbol('ERROR'),
  PENDING: Symbol('PENDING'),
};

const PROFILE_STATES = {
  NOSTART: Symbol('NOSTART'),
  UPLOAD_SUCCESS: Symbol('UPLOAD_SUCCESS'),
  UPLOAD_ERROR: Symbol('UPLOAD_ERROR'),
  INPUT_SUCCESS: Symbol('INPUT_SUCCESS'),
  INPUT_ERROR: Symbol('INPUT_ERROR'),
};

const PROGRESS_ANIMATION_DELAY_MS = 500; // .animated-width

export {
  CHECK_BLOCK_EVERY_MS,
  DEFAULT_GAS_PRICE_GWEI,
  MAX_GAS_PRICE_GWEI,
  GAS_LIMITS,
  GEN_STATES,
  BUTTON_STATES,
  PROFILE_STATES,
  MIN_GALAXY,
  MAX_GALAXY,
  MIN_STAR,
  MAX_STAR,
  MIN_PLANET,
  MAX_PLANET,
  PLANET_ENTROPY_BITS,
  STAR_ENTROPY_BITS,
  GALAXY_ENTROPY_BITS,
  SEED_ENTROPY_BITS,
  ZOD,
  PROGRESS_ANIMATION_DELAY_MS,
};
