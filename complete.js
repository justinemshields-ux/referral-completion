const ZAPIER_COMPLETION_WEBHOOK = 'https://hooks.zapier.com/hooks/catch/26013950/ugjg5lf/';

// Get URL parameters
const urlParams = new URLSearchParams(window.location.search);
const patientNameFromURL = urlParams.get('patient');
const patientPhoneFromURL = urlParams.get('phone');

// Pre-fill form if patient name is in URL
if (patientNameFromURL) {
  document.getElementById('patientName').value = decodeURIComponent(patientNameFromURL);
  document.getElementById('patientName').disabled = true;
  document.getElementById('displayPatientName').textContent = decodeURIComponent(patientNameFromURL);
  document.getElementById('patientInfo').style.display = 'block';
}

document.getElementById('completionForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  
  const patientName = document.getElementById('patientName').value;
  const status = document.getElementById('status').value;
  const notes = document.getElementById('notes').value;
  const submitBtn = document.getElementById('submitBtn');
  const errorDiv = document.getElementById('errorMessage');
  
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';
  errorDiv.style.display = 'none';
  
  try {
  const completionData = {
    patient_name: patientName,
    patient_phone: patientPhoneFromURL || '',
    status: status,
    completion_notes: notes || 'No additional notes',
    completed_at: new Date().toISOString()
  };
  
  console.log('Sending completion data:', completionData);
  
  const response = await fetch(ZAPIER_COMPLETION_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(completionData)
  });
  
  console.log('Response:', response);
  
  if (!response.ok) {
    throw new Error('Failed to submit completion');
  }
  
    document.getElementById('successMessage').style.display = 'block';
    document.getElementById('completionForm').style.display = 'none';
    document.querySelector('.info').style.display = 'none';
    document.getElementById('patientInfo').style.display = 'none';
    
    console.log('Completion submitted successfully');
    
  } catch (error) {
    errorDiv.textContent = '❌ Error: ' + error.message + '. Please try again.';
    errorDiv.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Completion';
    console.error('Completion error:', error);
  }
});
