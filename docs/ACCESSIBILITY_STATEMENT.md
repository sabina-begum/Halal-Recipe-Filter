# Accessibility Statement

Date: 2026-03-26  
Product: CULINARIA (Recipe-App)  
Owner: CULINARIA Team

## Our Commitment

CULINARIA is committed to making our service accessible to everyone, including people with disabilities. We aim to meet **WCAG 2.1 Level AA** requirements and continuously improve accessibility across web experiences.

## Conformance Status

- Target standard: WCAG 2.1 AA
- Current status: Partially conformant
- Most recent internal audit: `docs/WCAG_LEGAL_REQUIREMENTS_STATUS_2026.md`

## Accessibility Features

- Keyboard-accessible navigation and controls across core flows
- Skip link support to jump to main content
- Dialog accessibility patterns applied for modal interactions
- Reduced motion support via `prefers-reduced-motion`
- Error/status messaging patterns in key UI areas

## Known Limitations

We are still improving:

- Automated + manual accessibility testing process in CI/release workflow
- Contrast and non-text contrast verification across all themes/components
- Programmatic form error linking consistency (`aria-invalid`, `aria-describedby`) in all forms

## Compatibility

CULINARIA is designed to work with modern browsers and assistive technologies, including:

- Screen readers (NVDA, JAWS, VoiceOver)
- Keyboard-only navigation
- Browser zoom/reflow scenarios

## Feedback and Contact

If you encounter an accessibility issue, please contact us:

- Email: [begumsabina81193@gmail.com](mailto:begumsabina81193@gmail.com)
- Subject line recommendation: `Accessibility issue - CULINARIA`

When reporting, please include:

- The page/feature where the issue occurred
- Device/browser and assistive technology used
- Steps to reproduce the problem

## Response and Remediation Process

- We aim to acknowledge accessibility reports within **5 business days**.
- We aim to provide a remediation update or plan within **15 business days**.
- Critical blockers are prioritized in the next available patch release.

## Ongoing Improvement

Accessibility is part of our ongoing development process. We periodically review and update our implementation and this statement as improvements are released.
