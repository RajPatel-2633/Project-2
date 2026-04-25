import SignUpForm from '../components/SignUpForm'
import HeroSection from '../components/HeroSection'

const SignUp = () => {
  return (
    <main className="min-h-screen lg:h-screen flex flex-col lg:flex-row font-sans overflow-hidden">
      <SignUpForm />
      <HeroSection />
    </main>
  )
}

export default SignUp
