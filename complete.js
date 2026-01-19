// ---- Config ----
const ZAPIER_COMPLETION_WEBHOOK =
  'https://hooks.zapier.com/hooks/catch/26013950/ugjg5lf/';

// ---- URL params / prefill ----
const urlParams = new URLSearchParams(window.location.search);
const patientNameFromURL = urlParams.get('patient');
const patientPhoneFromURL = urlParams.get('phone');

window.addEventListener('DOMContentLoaded', () => {
  const patientNameInput = document.getElementById('patientName');
  const displayPatientName = document.getElementById('displayPatientName');
  const patientInfoBlock = document.getElementById('patientInfo');

  if (patientNameFromURL) {
    const decodedName = decodeURIComponent(patientNameFromURL);
    patientNameInput.value = decodedName;
    patientNameInput.disabled = true;

    if (displayPatientName) {
      displayPatientName.textContent = decodedName;
    }
    if (patientInfoBlock) {
      patientInfoBlock.style.display = 'block';
    }
  }
});

// ---- Form submission ----
document.getElementById('completionForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const patientName = document.getElementById('patientName').value.trim();
  const status = document.getElementById('status').value;
  const notes = document.getElementById('notes').value.trim();
  const submitBtn = document.getElementById('submitBtn');
  const errorDiv = document.getElementById('errorMessage');
  const successDiv = document.getElementById('successMessage');

  // Reset UI state
  errorDiv.style.display = 'none';
  successDiv.style.display = 'none';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Submitting...';

  // Basic validation
  if (!patientName || !status) {
    errorDiv.textContent = '❌ Please complete required fields.';
    errorDiv.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Completion';
    return;
  }

  const completionData = {
    patient_name: patientName,
    patient_phone: patientPhoneFromURL || '',
    status: status,
    completion_notes: notes || 'No additional notes',
    completed_at: new Date().toISOString(),
  };

  console.log('Sending completion ', completionData);

  try {
    // Use no-cors so browser does not block the request on CORS
    await fetch(ZAPIER_COMPLETION_WEBHOOK, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(completionData),
    });

    // We cannot inspect the response in no-cors mode, so we assume success
    successDiv.style.display = 'block';
    document.getElementById('completionForm').style.display = 'none';

    const infoBlock = document.querySelector('.info');
    const patientInfoBlock = document.getElementById('patientInfo');
    if (infoBlock) infoBlock.style.display = 'none';
    if (patientInfoBlock) patientInfoBlock.style.display = 'none';

    console.log('Completion submitted (no-cors, assumed success)');
  } catch (error) {
    console.error('Completion error:', error);
    errorDiv.textContent = '❌ Error: Could not submit completion. Please try again.';
    errorDiv.style.display = 'block';
    submitBtn.disabled = false;
    submitBtn.textContent = 'Submit Completion';
  }
});

