// Menu hamburger functionality
document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    hamburger.addEventListener('click', function () {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header background change on scroll
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'linear-gradient(135deg, rgba(255, 107, 53, 0.95) 0%, rgba(211, 47, 47, 0.95) 100%)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'linear-gradient(135deg, #FF6B35 0%, #D32F2F 100%)';
        header.style.backdropFilter = 'none';
    }
});

// Form submission
// document.querySelector('.contato-form').addEventListener('submit', function(e) {
//     e.preventDefault();

//     const formData = new FormData(this);
//     const nome = formData.get('nome');
//     const email = formData.get('email');
//     const empresa = formData.get('empresa');
//     const mensagem = formData.get('mensagem');

//     if (!nome || !email || !mensagem) {
//         alert('Por favor, preencha todos os campos obrigatórios.');
//         return;
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//         alert('Por favor, insira um e-mail válido.');
//         return;
//     }

//     const submitButton = this.querySelector('button[type="submit"]');
//     const originalText = submitButton.textContent;

//     submitButton.textContent = 'Enviando...';
//     submitButton.disabled = true;

//     // Preparar dados para enviar no corpo JSON
//     const dataToSend = {
//         nome,
//         email,
//         empresa,
//         mensagem
//     };

//     fetch('http://localhost:5678/webhook/0d19b485-1044-476a-b52e-723b52e0c272', {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(dataToSend)
//     })
//     .then(response => {
//         if (!response.ok) throw new Error('Erro ao enviar formulário');
//         return response.json(); // ou response.text() conforme sua resposta esperada
//     })
//     .then(data => {
//         alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
//         this.reset();
//     })
//     .catch(error => {
//         alert('Erro ao enviar a mensagem. Tente novamente mais tarde.');
//         console.error(error);
//     })
//     .finally(() => {
//         submitButton.textContent = originalText;
//         submitButton.disabled = false;
//     });
// });

document.querySelector('.contato-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const empresa = document.getElementById('empresa').value;
    const mensagem = document.getElementById('mensagem').value;

    const dados = {
        "Nome": nome,
        "Email": email,
        "Empresa": empresa,
        "Mensagem": mensagem
    };

    console.log(dados)
    try {
        const res = await fetch('https://script.google.com/macros/s/AKfycbwE83IBRwGgWRrUwlRn7B3qIhGB8fwiR8af_M6NI252wR1sCdIr2YWoIrrQaVcmSqBRmQ/exec', {
            method: 'POST',
            body: JSON.stringify(dados),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (res.ok) {
            window.alert("Deu certo!")
        } else {
            const errorData = await res.json();
            window.alert("Deu errado!", errorData)
        }
    } catch (error) {
        console.error(error);
    }
});




// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function () {
    const animatedElements = document.querySelectorAll('.servico-card, .stat, .feature');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + '+';
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + '+';
        }
    }

    updateCounter();
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/\D/g, ''));
                if (number && !stat.classList.contains('animated')) {
                    stat.classList.add('animated');
                    animateCounter(stat, number);
                }
            });
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', function () {
    const experienciaSection = document.querySelector('.experiencia-stats');
    if (experienciaSection) {
        statsObserver.observe(experienciaSection);
    }
});


// Add loading animation
window.addEventListener('load', function () {
    document.body.classList.add('loaded');
});

// Add CSS for loading animation
const style = document.createElement('style');
style.textContent = `
    body:not(.loaded) {
        overflow: hidden;
    }
    
    body:not(.loaded)::before {
        content: '';
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #FF6B35 0%, #D32F2F 100%);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    body:not(.loaded)::after {
        content: 'Carregando...';
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-family: 'Poppins', sans-serif;
        font-size: 1.5rem;
        z-index: 10000;
    }
`;
document.head.appendChild(style);

