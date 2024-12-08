document.addEventListener('DOMContentLoaded', () => {
  const wrapper = document.querySelector('.wrapper');
  const signUpBtnLink = document.querySelector('.signUpBtn-link');
  const signInBtnLink = document.querySelector('.signInBtn-link');
  
  signUpBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
  });
  
  signInBtnLink.addEventListener('click', () => {
    wrapper.classList.toggle('active');
  });

  // Handle form submissions
  const forms = document.querySelectorAll('form');
  forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: new URLSearchParams(formData)
      });

      if (response.redirected) {
        window.location.href = response.url;
      }
    });
  });

  // Handle URL parameters for showing messages
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const success = urlParams.get('success');

  if (error) {
    alert('Error: ' + error.replace('-', ' '));
  }
  if (success) {
    alert('Success: ' + success.replace('-', ' '));
  }
});