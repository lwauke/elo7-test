(async function(doc) {
  const h = require('hyperscript');

  const jobsList = doc.querySelector('.jobs-list');

  const errMsg = doc.querySelector('.err-msg');
  
  const endpoint = 'http://www.mocky.io/v2/5d6fb6b1310000f89166087b';  

  const maskLocal = ({
    bairro: b,
    cidade: c,
    pais: p
  }) => `${b} - ${c}, ${p}`;
  
  const noLocalMsg = 'Remoto';
  
  const jobObjToHTML = ({
    cargo,
    link,
    localizacao: l
  }) => h(
    'a.job-link',
    {
      href: link,
      target: '_blank'
    },
    h('span.job-role', cargo),
    h('span.job-local', l ? maskLocal(l) : noLocalMsg)  
  );
  
  const jobsListToHTML = jobs => 
    jobs
      .map(jobObjToHTML)
      .map(html => h('li.job-item', html));

  try {
    jobsList.classList.add('loading');

    const req = await fetch(endpoint);
    
    if (!req.ok) {
      throw new Error(req.statusText);
    }

    const { vagas } = await req.json();

    const activeJobs = vagas.filter(el => el.ativa);

    jobsList.append(...jobsListToHTML(activeJobs));
  } catch (err) {
    errMsg.classList.remove('hidden');
    console.error(err)
  } finally {
    jobsList.classList.remove('loading');
  }
})(document);