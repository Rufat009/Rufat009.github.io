// components/contacts/contacts.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            const formData = new FormData(form);
            
            formData.append('access_key', 'd65989bf-2ada-4894-92f6-2623d96a01d4');
            formData.append('subject', window.DevinyI18n?.message('formSubject') || 'New request from Deviny website');
            
            btn.disabled = true;
            btn.innerHTML = `<span>${window.DevinyI18n?.message('sending') || 'SENDING...'}</span> <i class="fa-solid fa-spinner fa-spin"></i>`;
            
            let errorBox = form.querySelector('.form-error-box');
            if (!errorBox) {
                errorBox = document.createElement('div');
                errorBox.className = 'form-error-box';
                errorBox.style.marginTop = '16px';
                errorBox.style.color = '#ef4444';
                errorBox.style.fontSize = '14px';
                errorBox.style.textAlign = 'center';
                form.appendChild(errorBox);
            }
            errorBox.textContent = '';
            
            try {
                const response = await fetch('https://api.web3forms.com/submit', {
                    method: 'POST',
                    body: formData
                });
                
                const result = await response.json();
                
                if (result.success) {
                    btn.innerHTML = `<span>${window.DevinyI18n?.message('sent') || 'REQUEST SENT'}</span> <i class="fa-solid fa-check"></i>`;
                    btn.classList.add('success');
                    form.reset();
                    
                    const replyBtns = document.querySelectorAll('.reply-btn');
                    replyBtns.forEach(b => b.classList.remove('active'));
                    if(replyBtns.length > 0) {
                        replyBtns[0].classList.add('active');
                    }
                    document.getElementById('reply_method').value = 'Telegram';
                } else {
                    errorBox.textContent = (window.DevinyI18n?.message('sendError') || 'Sending error: ') + result.message;
                    btn.innerHTML = originalText;
                }
            } catch (error) {
                errorBox.textContent = window.DevinyI18n?.message('networkError') || 'Network error. Check your internet connection.';
                btn.innerHTML = originalText;
            } finally {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.classList.remove('success');
                    errorBox.textContent = '';
                }, 4000);
            }
        });

        const replyBtns = document.querySelectorAll('.reply-btn');
        const replyInput = document.getElementById('reply_method');
        replyBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                replyBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                replyInput.value = btn.dataset.value;
            });
        });
    }
});
