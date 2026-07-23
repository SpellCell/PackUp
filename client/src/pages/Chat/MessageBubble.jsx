const MessageBubble = ({ message, isOwn }) => {

    const senderName =
        message?.sender?.name || "Unknown User";

    return (

        <div

            className={`
                flex
                ${isOwn ? "justify-end" : "justify-start"}
            `}

        >

            <div

                className={`
                    max-w-[70%]
                    rounded-2xl
                    px-4
                    py-3

                    ${

                        isOwn

                        ?

                        "bg-indigo-600"

                        :

                        "bg-zinc-800"

                    }

                `}

            >

                {

                    !isOwn && (

                        <p className="text-xs text-indigo-300 font-semibold mb-1">

                            {senderName}

                        </p>

                    )

                }

                <p>

                    {message?.message}

                </p>

                <p className="text-xs opacity-60 mt-2">

                    {

                        message?.createdAt

                            ?

                            new Date(

                                message.createdAt

                            ).toLocaleTimeString([], {

                                hour: "2-digit",

                                minute: "2-digit"

                            })

                            :

                            ""

                    }

                </p>

            </div>

        </div>

    );

};

export default MessageBubble;