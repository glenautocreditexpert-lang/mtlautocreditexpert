function scrollToForm() {
    document.querySelector("section").scrollIntoView({ behavior: "smooth" });
}

function getMontrealTime() {
    return new Date().toLocaleString("en-CA", {
        timeZone: "America/Toronto",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
    });
}

const translations = {
    en: {
        title: "Get Approved Today",
        subtitle: "Good credit • Bad credit • No credit • Bankruptcy",
        apply: "Apply Now",
        quick: "Quick Application",
        fullName: "Full Name",
        phone: "Phone Number",
        email: "Email",
        income: "Monthly Income",
        employmentOptions: ["Employment Status", "Employed", "Self-employed", "Unemployed"],
        creditOptions: ["Credit Situation", "Good", "Bad", "No Credit", "Bankruptcy"],
        submit: "Submit Application",
        success: "Thank you! Your application has been successfully submitted.",
        formError: "Something went wrong. Please try again.",
        errors: {
            phoneRequired: "Phone number is required.",
            phoneInvalid: "Please enter a valid 10-digit phone number.",
            emailRequired: "Email is required.",
            emailInvalid: "Please enter a valid email address."
        }
    },
    fr: {
        title: "Obtenez une approbation aujourd’hui",
        subtitle: "Bon crédit • Mauvais crédit • Aucun crédit • Faillite",
        apply: "Postuler",
        quick: "Demande rapide",
        fullName: "Nom complet",
        phone: "Numéro de téléphone",
        email: "Courriel",
        income: "Revenu mensuel",
        employmentOptions: ["Statut d’emploi", "Employé", "Travailleur autonome", "Sans emploi"],
        creditOptions: ["Situation de crédit", "Bon", "Mauvais", "Aucun crédit", "Faillite"],
        submit: "Soumettre la demande",
        success: "Merci ! Votre demande a été soumise avec succès.",
        formError: "Une erreur s’est produite. Veuillez réessayer.",
        errors: {
            phoneRequired: "Le numéro de téléphone est requis.",
            phoneInvalid: "Veuillez entrer un numéro de téléphone valide à 10 chiffres.",
            emailRequired: "Le courriel est requis.",
            emailInvalid: "Veuillez entrer une adresse courriel valide."
        }
    }
};

let currentLang = "en";

function setLang(lang) {
    currentLang = lang;
    const t = translations[lang];

    document.getElementById("title").innerText = t.title;
    document.getElementById("subtitle").innerText = t.subtitle;

    document.querySelector(".cta").innerText = t.apply;
    document.querySelector(".gold").innerText = t.quick;

    const form = document.querySelector("#my-form");

    form.name.placeholder = t.fullName;
    form.phone.placeholder = t.phone;
    form.email.placeholder = t.email;
    form.income.placeholder = t.income;

    const employment = form.employment;
    employment.options[0].text = t.employmentOptions[0];
    employment.options[1].text = t.employmentOptions[1];
    employment.options[2].text = t.employmentOptions[2];
    employment.options[3].text = t.employmentOptions[3];

    const credit = form.credit;
    credit.options[0].text = t.creditOptions[0];
    credit.options[1].text = t.creditOptions[1];
    credit.options[2].text = t.creditOptions[2];
    credit.options[3].text = t.creditOptions[3];
    credit.options[4].text = t.creditOptions[4];

    document.querySelector("[data-fs-submit-btn]").innerText = t.submit;

    if (phoneErrorKey) showError("phone", phoneErrorKey);
    if (emailErrorKey) showError("email", emailErrorKey);

    refreshStatusMessage();
}

const successBox = document.querySelector("[data-fs-success]");
const errorBox = document.querySelector("[data-fs-error]");

let statusState = null;

function setStatusMessage(el, message) {
    el.textContent = message;
    el.setAttribute("data-fs-active", "");
}

function clearStatusMessage(el) {
    el.removeAttribute("data-fs-active");
    el.textContent = "";
}

function refreshStatusMessage() {
    if (statusState === "success") {
        successBox.textContent = translations[currentLang].success;
    } else if (statusState === "error") {
        errorBox.textContent = translations[currentLang].formError;
    }
}

const form = document.querySelector("#my-form");
const timezoneField = document.createElement("input");
timezoneField.type = "hidden";
timezoneField.name = "montreal_time";
form.appendChild(timezoneField);

const phoneError = document.getElementById("phone-error");
const emailError = document.getElementById("email-error");

let phoneErrorKey = null;
let emailErrorKey = null;

function showError(field, key) {
    const message = key ? translations[currentLang].errors[key] : "";
    if (field === "phone") {
        phoneErrorKey = key;
        phoneError.innerText = message;
    } else {
        emailErrorKey = key;
        emailError.innerText = message;
    }
}

function validatePhone() {
    const value = form.phone.value.trim();
    if (!value) return "phoneRequired";
    const digits = value.replace(/\D/g, "");
    if (!/^1?\d{10}$/.test(digits)) return "phoneInvalid";
    return null;
}

function validateEmail() {
    const value = form.email.value.trim();
    if (!value) return "emailRequired";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "emailInvalid";
    return null;
}

form.phone.addEventListener("input", () => {
    form.phone.value = form.phone.value.replace(/[^\d\s()+\-]/g, "");
    showError("phone", validatePhone());
});

form.email.addEventListener("input", () => showError("email", validateEmail()));

form.addEventListener("submit", function (e) {
    form.montreal_time.value = getMontrealTime();

    const phoneResult = validatePhone();
    const emailResult = validateEmail();

    showError("phone", phoneResult);
    showError("email", emailResult);

    if (phoneResult || emailResult) {
        e.preventDefault();
        e.stopImmediatePropagation();
    }
}, true);

window.formspree = window.formspree || function () {
    (formspree.q = formspree.q || []).push(arguments);
};

formspree('initForm', {
    formElement: '#my-form',
    formId: 'xzdqwrwy',
    renderSuccess: function (ctx, message) {
        if (message === null) {
            statusState = null;
            clearStatusMessage(successBox);
            return;
        }
        statusState = "success";
        clearStatusMessage(errorBox);
        setStatusMessage(successBox, translations[currentLang].success);
    },
    renderFormError: function (ctx, message) {
        if (message === null) {
            if (statusState === "error") statusState = null;
            clearStatusMessage(errorBox);
            return;
        }
        statusState = "error";
        clearStatusMessage(successBox);
        setStatusMessage(errorBox, translations[currentLang].formError);
    }
});