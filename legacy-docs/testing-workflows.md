# Testing Workflows

## Prerequisites

- Development server running on `http://localhost:8080/`
- Chrome browser available for remote debugging
- Puppeteer MCP tools configured

## Environment Setup

```bash
# Start development server
npm run dev

# Start Chrome with remote debugging (required for Puppeteer)
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --no-first-run --no-default-browser-check --disable-default-apps
```

## Puppeteer Browser Management

### Chrome Setup for Testing

```bash
# Clean Chrome instance with debugging
nohup /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222 --user-data-dir=/tmp/chrome-debug --disable-web-security --disable-features=VizDisplayCompositor > /dev/null 2>&1 &

# Verify browser connection
curl -s http://localhost:9222/json/version
```

### Connection Process

```javascript
// 1. Connect to Chrome
mcp__puppeteer__puppeteer_connect_active_tab()

// 2. Navigate to application
mcp__puppeteer__puppeteer_navigate({ url: "http://localhost:8080/" })

// 3. Take screenshot for verification
mcp__puppeteer__puppeteer_screenshot({ name: "connection-test" })
```

### Browser Cleanup (IMPORTANT)

```bash
# Always clean up after testing
pkill -f "chrome-debug"
rm -rf /tmp/chrome-debug
```

## Authentication Flow Testing

### "Try Demo Access" Flow

```javascript
// Find and click demo access button
mcp__puppeteer__puppeteer_evaluate({
  script: `
    const buttons = document.querySelectorAll('button');
    const demoButton = Array.from(buttons).find(btn => btn.textContent.includes('Try Demo Access'));
    if (demoButton) {
      demoButton.click();
      return { clicked: true, buttonText: demoButton.textContent };
    }
    return { clicked: false, error: 'Button not found' };
  `
})
```

## Onboarding Flow Testing

### Multi-Step Process

```javascript
// Step 1: Welcome (/onboarding/1)
const startButton = Array.from(document.querySelectorAll('button')).find(btn => 
  btn.textContent.toLowerCase().includes('get started')
);

// Step 2: Organization (/onboarding/2)
const nameInput = document.querySelector('input[name="name"]');
nameInput.value = 'Test Company';

// Step 3: Profile (/onboarding/3)
const jobRoleSelect = document.querySelectorAll('[role="combobox"]')[0];
jobRoleSelect.click();
```

### ShadCN UI Component Testing

```javascript
// Generic ShadCN Select interaction
const selectShadCNOption = (selectIndex, optionText) => `
  const selectElement = document.querySelectorAll('[role="combobox"]')[${selectIndex}];
  if (selectElement) {
    selectElement.click();
    setTimeout(() => {
      const option = Array.from(document.querySelectorAll('[role="option"]'))
        .find(opt => opt.textContent.includes('${optionText}'));
      if (option) option.click();
    }, 500);
  }
`;
```

## Console Error Detection

### Comprehensive Error Check

```javascript
mcp__puppeteer__puppeteer_evaluate({
  script: `
    const checks = {
      networkRequests: performance.getEntries().filter(entry => entry.name.includes('http')).length,
      failedRequests: performance.getEntries().filter(entry => entry.name.includes('http') && entry.responseEnd === 0).length,
      hasJSErrors: document.body.innerHTML.includes('Error') && !document.body.innerHTML.includes('Try again'),
      clerkLoaded: !!window.Clerk,
      apolloClientLoaded: !!window.__APOLLO_CLIENT__,
      pageLoaded: document.readyState === 'complete',
      currentUrl: window.location.href
    };
    
    return {
      ...checks,
      overallHealth: checks.failedRequests === 0 && checks.pageLoaded && checks.clerkLoaded && checks.apolloClientLoaded
    };
  `
})
```

## Error Boundary Testing

### Verify Error Handling

```javascript
// Check for proper error boundaries
mcp__puppeteer__puppeteer_evaluate({
  script: `
    const errorElements = document.querySelectorAll('[role="alert"], .error, .text-destructive');
    const toastMessages = document.querySelectorAll('[data-sonner-toast], .toast');
    
    return {
      hasErrorElements: errorElements.length > 0,
      errorMessages: Array.from(errorElements).map(el => el.textContent),
      toastMessages: Array.from(toastMessages).map(toast => toast.textContent),
      hasGracefulErrorHandling: document.body.innerHTML.includes('Try again')
    };
  `
})
```

## Testing Checklist

- [ ] Development server starts without errors
- [ ] Application loads at `http://localhost:8080/`
- [ ] No JavaScript console errors
- [ ] Authentication flow works end-to-end
- [ ] GraphQL client properly integrated
- [ ] Network requests succeed or fail gracefully
- [ ] Error boundaries catch and display errors
- [ ] Form validations work correctly
- [ ] Screenshots documented for key states

## Common Testing Patterns

```javascript
// Button interaction pattern
const clickButton = (buttonText) => `
  const button = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.includes('${buttonText}'));
  if (button) {
    button.click();
    return { clicked: true };
  }
  return { clicked: false };
`;

// Form validation pattern
const validateForm = () => `
  const errorElements = document.querySelectorAll('[role="alert"], .error');
  return {
    hasErrors: errorElements.length > 0,
    errors: Array.from(errorElements).map(el => el.textContent)
  };
`;
```