function openPanchangModal() {
  const modal = document.getElementById('panchangModal');
  if (modal) {
    // Dynamically set today's date in local Marathi format
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('panchangTodayDate').textContent = 'आजचा दिनांक: ' + today.toLocaleDateString('mr-IN', options);
    
    modal.classList.add('active');
  }
}

function closePanchangModal() {
  const modal = document.getElementById('panchangModal');
  if (modal) modal.classList.remove('active');
}

// Close modal when clicking outside the content box
window.addEventListener('click', (e) => {
  const modal = document.getElementById('panchangModal');
  if (e.target === modal) closePanchangModal();
});