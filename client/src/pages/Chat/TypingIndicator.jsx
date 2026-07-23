const TypingIndicator = ({ typingUser }) => {

    if (!typingUser) return null;

    return (

        <div className="px-6 py-2 text-sm text-indigo-400 animate-pulse">

            {typingUser} is typing...

        </div>

    );

};

export default TypingIndicator;