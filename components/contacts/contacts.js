/* components/contacts/contacts.js */
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
                const text = await response.text();
                let result;
                try {
                    result = JSON.parse(text);
                } catch (e) {
                    alert("CRITICAL PHP ERROR (Check this out): " + text);
                    return;
                }
                if (result.status === 'success') {
                    btn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
                    btn.style.background = '#10b981';
                    form.reset();
                } else {
                    alert("MAILER ERROR: " + result.message);
                }
            } catch (error) {
                alert("NETWORK/JS ERROR: " + error.message);
            } finally {
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = originalText;
                    btn.style.background = '';
                }, 5000);
            }
        });
    }
});