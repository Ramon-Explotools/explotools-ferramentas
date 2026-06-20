const form = document.querySelector("#picking-form");
const statusEl = document.querySelector("#status");
const submitButton = document.querySelector("#submit-button");
const dropzone = document.querySelector("#dropzone");
const fileInput = document.querySelector("#sales-pdfs");
const fileList = document.querySelector("#file-list");
const resultPanel = document.querySelector("#result-panel");
const pdfPreview = document.querySelector("#pdf-preview");
const pdfCanvasPreview = document.querySelector("#pdf-canvas-preview");
const openLink = document.querySelector("#open-link");
const downloadLink = document.querySelector("#download-link");
const printButton = document.querySelector("#print-button");
const tabButtons = document.querySelectorAll(".tab-button");
const modePanels = document.querySelectorAll(".mode-panel");
const receivingForm = document.querySelector("#receiving-form");
const receivingStatusEl = document.querySelector("#receiving-status");
const receivingSubmitButton = document.querySelector("#receiving-submit-button");
const invoiceDropzone = document.querySelector("#invoice-dropzone");
const invoiceInput = document.querySelector("#invoice-pdfs");
const invoiceFileList = document.querySelector("#invoice-file-list");
const locationSheetLinks = document.querySelectorAll(".location-sheet-link");
const resultEyebrow = document.querySelector("#result-eyebrow");
const resultTitle = document.querySelector("#result-title");

let selectedFiles = [];
let selectedInvoiceFiles = [];
let currentPdfUrl = "";

const getApiBaseUrl = () => {
  const configuredUrl = window.EXPLOTOOLS_API_BASE_URL || localStorage.getItem("EXPLOTOOLS_API_BASE_URL");
  if (configuredUrl) {
    return configuredUrl.replace(/\/$/, "");
  }

  if (window.location.protocol === "file:") {
    return "http://127.0.0.1:8000";
  }

  if (window.location.hostname.endsWith("github.io")) {
    return "https://explotools-coleta-api.onrender.com";
  }

  return `${window.location.protocol}//${window.location.hostname}:8000`;
};

locationSheetLinks.forEach((link) => {
  if (window.EXPLOTOOLS_LOCATION_SHEET_URL) {
    link.href = window.EXPLOTOOLS_LOCATION_SHEET_URL;
  }
});

const formatBytes = (bytes) => {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${(bytes / 1024 / 1024).toFixed(1).replace(".", ",")} MB`;
};

const updateFileList = () => {
  fileList.innerHTML = "";

  selectedFiles.forEach((file) => {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    const meta = document.createElement("div");
    const size = document.createElement("span");
    const removeButton = document.createElement("button");

    name.textContent = file.name;
    size.textContent = formatBytes(file.size);
    meta.className = "file-meta";
    removeButton.className = "remove-file";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remover ${file.name}`);
    removeButton.textContent = "x";
    removeButton.addEventListener("click", () => {
      selectedFiles = selectedFiles.filter((selectedFile) => selectedFile !== file);
      updateFileList();
    });

    meta.append(size, removeButton);
    item.append(name, meta);
    fileList.appendChild(item);
  });

  statusEl.textContent = selectedFiles.length
    ? `${selectedFiles.length} PDF(s) selecionado(s).`
    : "Aguardando arquivos.";
};

const acceptFiles = (files) => {
  selectedFiles = Array.from(files).filter(
    (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
  );
  updateFileList();
};

const setPreview = (blob, options = {}) => {
  if (currentPdfUrl) {
    URL.revokeObjectURL(currentPdfUrl);
  }

  currentPdfUrl = URL.createObjectURL(blob);
  resultEyebrow.textContent = options.eyebrow || "PDF pronto";
  resultTitle.textContent = options.title || "Pré-visualização da ordem";
  downloadLink.download = options.filename || "ordem_de_coleta.pdf";
  pdfPreview.src = currentPdfUrl;
  openLink.href = currentPdfUrl;
  downloadLink.href = currentPdfUrl;
  resultPanel.hidden = false;
  resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  renderCanvasPreview(blob);
};

const updateInvoiceFileList = () => {
  invoiceFileList.innerHTML = "";

  selectedInvoiceFiles.forEach((file) => {
    const item = document.createElement("li");
    const name = document.createElement("strong");
    const meta = document.createElement("div");
    const size = document.createElement("span");
    const removeButton = document.createElement("button");

    name.textContent = file.name;
    size.textContent = formatBytes(file.size);
    meta.className = "file-meta";
    removeButton.className = "remove-file";
    removeButton.type = "button";
    removeButton.setAttribute("aria-label", `Remover ${file.name}`);
    removeButton.textContent = "x";
    removeButton.addEventListener("click", () => {
      selectedInvoiceFiles = selectedInvoiceFiles.filter((selectedFile) => selectedFile !== file);
      updateInvoiceFileList();
    });

    meta.append(size, removeButton);
    item.append(name, meta);
    invoiceFileList.appendChild(item);
  });

  receivingStatusEl.textContent = selectedInvoiceFiles.length
    ? `${selectedInvoiceFiles.length} PDF(s) de invoice selecionado(s).`
    : "Aguardando arquivos.";
};

const acceptInvoiceFiles = (files) => {
  selectedInvoiceFiles = Array.from(files).filter(
    (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
  );
  updateInvoiceFileList();
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetTab = button.dataset.tab;
    tabButtons.forEach((tabButton) => {
      tabButton.classList.toggle("is-active", tabButton === button);
    });
    modePanels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== targetTab;
    });
  });
});

const renderCanvasPreview = async (blob) => {
  pdfCanvasPreview.innerHTML = "<p>Carregando pré-visualização...</p>";

  if (!window.pdfjsLib) {
    pdfCanvasPreview.innerHTML = "<p>Use Abrir ou Baixar PDF para visualizar neste navegador.</p>";
    return;
  }

  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";
    const data = await blob.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    pdfCanvasPreview.innerHTML = "";

    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const baseViewport = page.getViewport({ scale: 1 });
      const isMobile = window.matchMedia("(max-width: 700px)").matches;
      const containerWidth = Math.min(pdfCanvasPreview.clientWidth || 820, 920);
      const targetWidth = isMobile ? Math.max(containerWidth * 2.15, 760) : containerWidth;
      const scale = targetWidth / baseViewport.width;
      const viewport = page.getViewport({ scale });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      canvas.className = "pdf-page-canvas";
      pdfCanvasPreview.appendChild(canvas);
      await page.render({ canvasContext: context, viewport }).promise;
    }
  } catch (error) {
    pdfCanvasPreview.innerHTML = "<p>Não foi possível montar a prévia rápida. Use Abrir ou Baixar PDF.</p>";
  }
};

fileInput.addEventListener("change", () => {
  acceptFiles(fileInput.files);
});

invoiceInput.addEventListener("change", () => {
  acceptInvoiceFiles(invoiceInput.files);
});

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragging");
  });
});

dropzone.addEventListener("drop", (event) => {
  acceptFiles(event.dataTransfer.files);
});

["dragenter", "dragover"].forEach((eventName) => {
  invoiceDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    invoiceDropzone.classList.add("is-dragging");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  invoiceDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    invoiceDropzone.classList.remove("is-dragging");
  });
});

invoiceDropzone.addEventListener("drop", (event) => {
  acceptInvoiceFiles(event.dataTransfer.files);
});

printButton.addEventListener("click", () => {
  if (!currentPdfUrl) {
    return;
  }

  const previewWindow = window.open(currentPdfUrl, "_blank");
  if (previewWindow) {
    previewWindow.addEventListener("load", () => previewWindow.print(), { once: true });
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedFiles.length) {
    statusEl.textContent = "Selecione ao menos um PDF de venda.";
    return;
  }

  const formData = new FormData();
  selectedFiles.forEach((file) => {
    formData.append("sales_pdfs", file);
  });

  submitButton.disabled = true;
  statusEl.textContent = "Gerando ordem de coleta...";

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/generate-picking-order`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Falha ao gerar PDF." }));
      throw new Error(error.detail || "Falha ao gerar PDF.");
    }

    const blob = await response.blob();
    setPreview(blob, {
      title: "Pré-visualização da ordem de coleta",
      filename: "ordem_de_coleta.pdf",
    });
    statusEl.textContent = "PDF gerado. Você pode baixar ou imprimir abaixo.";
  } catch (error) {
    statusEl.textContent = error.message;
  } finally {
    submitButton.disabled = false;
  }
});

receivingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!selectedInvoiceFiles.length) {
    receivingStatusEl.textContent = "Selecione ao menos um PDF de invoice.";
    return;
  }

  const formData = new FormData();
  selectedInvoiceFiles.forEach((file) => {
    formData.append("invoice_pdfs", file);
  });

  receivingSubmitButton.disabled = true;
  receivingStatusEl.textContent = "Gerando ordem de recebimento...";

  try {
    const response = await fetch(`${getApiBaseUrl()}/api/generate-receiving-order`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Falha ao gerar PDF." }));
      throw new Error(error.detail || "Falha ao gerar PDF.");
    }

    const blob = await response.blob();
    setPreview(blob, {
      title: "Pré-visualização da ordem de recebimento",
      filename: "ordem_de_recebimento.pdf",
    });
    receivingStatusEl.textContent = "PDF gerado. Você pode baixar ou imprimir abaixo.";
  } catch (error) {
    receivingStatusEl.textContent = error.message;
  } finally {
    receivingSubmitButton.disabled = false;
  }
});
