import React from 'react';
import classNames from "@/utils/classNames";
import ConverseLogo from "@/components/global/ConverseLogo";

let defaultPromotionalText = `The all-in-one query management tool for support agents, providing task tracking and seamless customer communication in a unified interface.`;

const MessengerEmptyChatWindow = ({ message }) => (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
            <div className={classNames("text-center")}>

                <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
                    <div className="mx-auto max-w-2xl text-center">

                        <ConverseLogo className={'w-24 h-24 my-6 mx-auto'} />

                        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Converse Messenger</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-600">
                            { message || defaultPromotionalText }
                        </p>
                    </div>
                </div>

            </div>
        </div>
    </div>
);

export default MessengerEmptyChatWindow;