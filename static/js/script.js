document.addEventListener("DOMContentLoaded", function(){
	// Order form validation
	const orderForm = document.getElementById("orderForm");
	if(orderForm){
		orderForm.addEventListener("submit", function(e){
			// Basic frontend checks
			const name = document.getElementById("name").value.trim();
			const mobile = document.getElementById("mobile").value.trim();
			const fruit = document.getElementById("fruit").value;
			const qty = document.getElementById("quantity").value;
			const address = document.getElementById("address").value.trim();

			if(!name || !mobile || !fruit || !qty || !address){
				e.preventDefault();
				alert("Please fill out all required fields before submitting your order.");
				return false;
			}
			if(!/^\d{10}$/.test(mobile)){
				e.preventDefault();
				alert("Please enter a valid 10-digit mobile number.");
				return false;
			}
			// Let the form submit to server; server will show success message
		});
	}

	// Observe elements and add 'in-view' when visible to trigger CSS animations
	const observerOpts = { root: null, rootMargin: '0px', threshold: 0.15 };
	const io = new IntersectionObserver((entries) => {
		entries.forEach(entry => {
			if(entry.isIntersecting){
				entry.target.classList.add('in-view');
			}
		});
	}, observerOpts);

	document.querySelectorAll('.animate-on-scroll, .slide-in, .hero-image, .stat-item, .floating-banner').forEach(el => {
		io.observe(el);
	});

	// Simple hero parallax: move floating decorations slightly with mouse
	const hero = document.querySelector('.hero');
	const heroDecor = document.querySelectorAll('.hero-decor .fruit');
	if(hero && heroDecor.length){
		hero.addEventListener('mousemove', function(e){
			const rect = hero.getBoundingClientRect();
			const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 .. 0.5
			const y = (e.clientY - rect.top) / rect.height - 0.5;
			heroDecor.forEach((el, idx) => {
				// subtle transform, different intensities per element
				const depth = 6 + idx * 3;
				el.style.transform = `translate(${x * depth}px, ${y * (depth/1.5)}px)`;
			});
		});
		// reset on mouse leave
		hero.addEventListener('mouseleave', () => {
			heroDecor.forEach(el => el.style.transform = '');
		});
	}

});

// Contact form is not submitted to backend — simple UX feedback
function contactSubmitted(ev){
	ev.preventDefault();
	const name = document.getElementById("cname").value.trim();
	const email = document.getElementById("cemail").value.trim();
	const message = document.getElementById("cmessage").value.trim();
	if(!name || !email || !message){
		alert("Please fill out all fields to send a message.");
		return false;
	}
	alert("Thanks! Your message was received (this is a demo). We will get back to you soon.");
	// Reset form
	document.getElementById("contactForm").reset();
	return false;
}
