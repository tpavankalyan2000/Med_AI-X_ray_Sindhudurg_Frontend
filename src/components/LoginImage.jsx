import { motion } from 'framer-motion'

const LoginImage = () => {
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-800 to-primary-900 p-8">
      <div className="max-w-md text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-3xl font-bold mb-4">Advanced Medical AI</h2>
          <p className="text-primary-100 mb-6">
            Leverage cutting-edge artificial intelligence for medical diagnosis and patient communication.
          </p>
          
          <div className="flex flex-col space-y-4">
            <Feature
              title="AI-Powered Chatbot"
              description="Intelligent patient communication and preliminary assessment"
              delay={0.4}
            />
            <Feature
              title="X-Ray Analysis"
              description="Advanced machine learning for radiological image interpretation"
              delay={0.5}
            />
            <Feature
              title="Secure & Compliant"
              description="HIPAA-compliant data handling and storage"
              delay={0.6}
            />
          </div>
        </motion.div>
        
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <div className="inline-flex items-center justify-center p-4 bg-white/10 rounded-full mb-4">
            <img 
              src="https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
              alt="Medical Technology" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    </div>
  )
}

const Feature = ({ title, description, delay }) => (
  <motion.div
    className="flex items-start"
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.5, delay }}
  >
    <div className="flex-shrink-0 mt-1">
      <div className="w-4 h-4 rounded-full bg-accent-500"></div>
    </div>
    <div className="ml-3">
      <h4 className="text-lg font-medium text-white">{title}</h4>
      <p className="text-primary-200">{description}</p>
    </div>
  </motion.div>
)

export default LoginImage