import { api, auth } from '../../utils';

const ADMIN = 'Admin';
const DIRECTOR = 'Director';
const MEMBER = 'Member';
const SQUAD_LEADER = 'SquadLeader';
const instruments = {
  ANY: 'Any',
  BARITONE: 'Baritone',
  MELLOPHONE: 'Mellophone',
  PERCUSSION: 'Percussion',
  SOUSAPHONE: 'Sousaphone',
  TROMBONE: 'Trombone',
  TRUMPET: 'Trumpet'
};
const parts = {
  ANY: 'Any',
  BASS: 'Bass',
  CYMBALS: 'Cymbals',
  EFER: 'Efer',
  FIRST: 'First',
  FLUGEL: 'Flugel',
  SECOND: 'Second',
  SNARE: 'Snare',
  SOLO: 'Solo',
  TENOR: 'Tenor'
};
const instrumentParts = {
  [instruments.ANY]: [parts.ANY],
  [instruments.BARITONE]: [parts.FIRST],
  [instruments.MELLOPHONE]: [parts.FIRST, parts.SECOND],
  [instruments.PERCUSSION]: [parts.BASS, parts.CYMBALS, parts.SNARE, parts.TENOR],
  [instruments.SOUSAPHONE]: [parts.FIRST],
  [instruments.TROMBONE]: [parts.FIRST, parts.SECOND, parts.BASS],
  [instruments.TRUMPET]: [parts.EFER, parts.SOLO, parts.FIRST, parts.SECOND, parts.FLUGEL]
};
const roles = {
  ADMIN,
  DIRECTOR,
  MEMBER,
  SQUAD_LEADER
};

const getAll = () => api.get('/users');
const getById = id => api.get(`/users/${id || auth.getUser().buckId}`);
const getProfile = () => api.get(`/users/profile/${auth.getUser().buckId}`);
const isAdmin = ({ role }) => role === ADMIN;
const isDirector = ({ role }) => role === DIRECTOR;
const isMember = ({ role }) => role === MEMBER;
const isSquadLeader = ({ role }) => role === SQUAD_LEADER;
const isTriChallengeUser = ({ spot }) => ['J'].includes(spot.row);
const resetPassword = (password_reset_request_id, password, { id }) => api.post(`/users/${id}/reset_password`, { password_reset_request_id, password });
const editSpot = (id, row, file) => new Promise(resolve => {
  setTimeout(resolve, 1000);
});
const editPart = (id, part) => new Promise(resolve => {
  setTimeout(resolve, 1000);
});
const partsForInstrument = instrument => instrumentParts[instrument];

export default {
  editPart,
  editSpot,
  getAll,
  getById,
  getProfile,
  instruments,
  isAdmin,
  isDirector,
  isMember,
  isSquadLeader,
  isTriChallengeUser,
  parts,
  partsForInstrument,
  resetPassword,
  roles
};
