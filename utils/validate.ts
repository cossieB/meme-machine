export function validateInput(username: string, password: string, password2 = password) {
    let errors: string[] = []
    if (username.length > 15 || username.length < 3) {
        errors.push("Username must be between 3 and 15 characters long")
    }
    if (!/^[a-z]/i.test(username)) {
        errors.push("Username must start with a letter")
    }
    if (/\W/.test(username)) {
        errors.push("Username can only contain letters and numbers")
    }
    if (password.length < 8) {
        errors.push("Password must be at least 8 characters")
    }
    if (password != password2) {
        errors.push("Passwords do not match")
    }
    return errors
}