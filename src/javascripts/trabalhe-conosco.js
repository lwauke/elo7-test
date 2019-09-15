const jobsList = document.querySelector('.jobs-list');

const endpoint = 'http://www.mocky.io/v2/5d6fb6b1310000f89166087b';

const objToAttrs = obj =>
  Object.entries(obj)
    .map(([k, v]) => `${k}="${v}"`)
    .join(' ');

const generateEl = (tag, className = '', attrs = {}) =>
  content => `
    <${tag} class="${className}" ${objToAttrs(attrs)}>
      ${content}
    </${tag}>
  `;

const link = href => generateEl(
  'a',
  'job-link',
  { href, target: '_blank' }
);

const span = className => generateEl('span', className);

const li = generateEl('li', 'job-item');

const jobRole = span('job-role');

const jobLocal = span('job-local');

const maskLocal = ({
  bairro: b,
  cidade: c,
  pais: p
}) => `${b} - ${c}, ${p}`;

const noLocalMsg = 'Remoto';

const jobObjToHTML = ({
  cargo: c,
  link: l,
  localizacao: lo
}) => link(l)(
  `${jobRole(c)} ${jobLocal(lo ? maskLocal(lo) : noLocalMsg)}`
);

const jobsListToHTML = jobs =>
  jobs
    .map(jobObjToHTML)
    .map(li)
    .join('');

const fetchJobs = async () => {
  const req = await fetch(endpoint);
  const { vagas } = await req.json();

  const activeJobs = vagas.filter(el => el.ativa);
  
  jobsList.innerHTML = jobsListToHTML(activeJobs);
}

fetchJobs();