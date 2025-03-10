document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      })
    })
  })

  // Skill animation
  const skillItems = document.querySelectorAll(".skill-item")
  const animateSkills = () => {
    skillItems.forEach((item) => {
      if (isElementInViewport(item)) {
        item.classList.add("animate")
      }
    })
  }

  const isElementInViewport = (el) => {
    const rect = el.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  window.addEventListener("scroll", animateSkills)

  // Contact form handling
  const contactForm = document.getElementById("contact-form")
  const formInputs = contactForm.querySelectorAll("input, textarea")
  const button = contactForm.querySelector("button")
  const buttonText = button.querySelector(".button-text")
  const buttonIcon = button.querySelector(".button-icon")
  const formMessage = document.createElement("div")
  formMessage.className = "form-message"
  contactForm.appendChild(formMessage)

  const validateInput = (input) => {
    const errorMessage = input.nextElementSibling.nextElementSibling
    if (input.validity.valid) {
      errorMessage.textContent = ""
      input.classList.remove("invalid")
    } else {
      if (input.validity.valueMissing) {
        errorMessage.textContent = "Este campo é obrigatório."
      } else if (input.validity.typeMismatch) {
        errorMessage.textContent = "Por favor, insira um valor válido."
      }
      input.classList.add("invalid")
    }
  }

  formInputs.forEach((input) => {
    input.addEventListener("blur", () => validateInput(input))
    input.addEventListener("input", () => validateInput(input))
  })

  contactForm.addEventListener("submit", (e) => {
    e.preventDefault()
    let isValid = true

    formInputs.forEach((input) => {
      validateInput(input)
      if (!input.validity.valid) {
        isValid = false
        input.classList.add("shake")
        setTimeout(() => input.classList.remove("shake"), 500)
      }
    })

    if (isValid) {
      button.disabled = true
      buttonText.textContent = "Enviando..."
      buttonIcon.innerHTML = '<i class="fas fa-spinner fa-spin"></i>'

      const formData = new FormData(contactForm)

      fetch("https://formspree.io/f/xdkadkqg", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            buttonText.textContent = "Mensagem Enviada!"
            buttonIcon.innerHTML = '<i class="fas fa-check"></i>'
            contactForm.reset()
            formMessage.textContent = "Sua mensagem foi enviada com sucesso!"
            formMessage.style.color = "green"
          } else {
            throw new Error("Erro no envio")
          }
        })
        .catch((error) => {
          console.error("Erro:", error)
          buttonText.textContent = "Erro no envio"
          buttonIcon.innerHTML = '<i class="fas fa-exclamation-triangle"></i>'
          formMessage.textContent = "Houve um erro ao enviar sua mensagem. Por favor, tente novamente."
          formMessage.style.color = "red"
        })
        .finally(() => {
          setTimeout(() => {
            buttonText.textContent = "Enviar Mensagem"
            buttonIcon.innerHTML = '<i class="fas fa-paper-plane"></i>'
            button.disabled = false
            formMessage.textContent = ""
          }, 3000)
        })
    }
  })

  // Typewriter effect for subtitle
  const subtitle = document.querySelector("#home h2")
  const text = subtitle.textContent
  subtitle.textContent = ""
  let i = 0
  const typeWriter = () => {
    if (i < text.length) {
      subtitle.textContent += text.charAt(i)
      i++
      setTimeout(typeWriter, 100)
    }
  }
  typeWriter()

  // Mobile menu toggle functionality
  const menuToggle = document.querySelector(".menu-toggle")
  const navUl = document.querySelector("nav ul")

  menuToggle.addEventListener("click", () => {
    navUl.classList.toggle("show")
  })

  // Close mobile menu when a link is clicked
  const navLinks = document.querySelectorAll("nav ul li a")
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navUl.classList.remove("show")
    })
  })
})

