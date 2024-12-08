export class PDFApi {
	static async uploadPDF(formData: FormData) {
		const response = await fetch('http://localhost:8080/api/v1/pdf/upload', {
			method: 'POST',
			body: formData
		});

		const data = await response.json();
		return data;
	}

	static async summarizePDF(pdfId: string) {
		if (!pdfId) {
			throw new Error('PDF is required to summarize the PDF.');
		}
		const response = await fetch(`http://localhost:8080/api/v1/pdf/summarize`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pdf_id: pdfId
			})
		});
		const data = await response.json();
		return data.summary;
	}
	static async askQuestion(pdfId: string, question: string) {
		if (!pdfId) {
			throw new Error('PDF is required to ask a question.');
		}
		if (!question || question.trim() === '') {
			throw new Error('Question is required to ask a question.');
		}
		const response = await fetch(`http://localhost:8080/api/v1/pdf/ask`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				pdf_id: pdfId,
				question
			})
		});

		const data = await response.json();
		return data.answer;
	}
}
