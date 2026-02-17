// components/contacts/contacts.js
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button');
            const originalText = btn.innerHTML;
            const formData = new FormData(form);
            btn.disabled = true;
            btn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
            try {
                const response = await fetch('send-mail.php', {
                    method: 'POST',
                    body: formData
                });
                const result = await response.json();
                if (result.status === 'success') {
                    btn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
                    btn.style.background = '#10b981';
                    form.reset();
                } else {
                    throw new Error(result.message);
                }
            } catch (error) {
                console.error('Error:', error);
                btn.innerHTML = '<span>Error! Try again</span> <i class="fa-solid fa-xmark"></i>';
                btn.style.background = '#ef4444';
            } finally {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 4000);
            }
        });
    }
});