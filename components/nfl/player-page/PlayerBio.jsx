"use client";

export function PlayerBio({ wiki, bio }) {
    if (!wiki && !bio) return null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Career Overview (Wikipedia Summary) */}
            <div className="md:col-span-2 space-y-6">
                <section className="glass-card p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-orange-50 dark:bg-orange-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <h2 className="text-2xl font-black italic uppercase text-gray-900 dark:text-white mb-6 relative z-10">
                        Career Overview
                    </h2>

                    <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 relative z-10 leading-relaxed">
                        {wiki?.summary ? (
                            wiki.summary.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{paragraph}</p>
                            ))
                        ) : (
                            <p>No biography available.</p>
                        )}
                    </div>
                </section>

                {/* Playing Style / Professional Career */}
                {wiki?.playingStyle && (
                    <section className="glass-card p-8">
                        <h2 className="text-2xl font-black italic uppercase text-gray-900 dark:text-white mb-6">
                            Playing Style / NFL Career
                        </h2>
                        <div className="prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed">
                            {wiki.playingStyle.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    </section>
                )}

                {/* Personal Life */}
                {wiki?.personalLife && (
                    <section className="glass-card p-8">
                        <h2 className="text-2xl font-black italic uppercase text-gray-900 dark:text-white mb-6">
                            Personal Life
                        </h2>
                        <div className="prose prose-sm dark:prose-invert text-gray-600 dark:text-gray-300 leading-relaxed">
                            {wiki.personalLife.split('\n\n').map((paragraph, idx) => (
                                <p key={idx} className="mb-4">{paragraph}</p>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            {/* Quick Facts / Side Panel */}
            <div className="space-y-6">
                <div className="glass-card p-6">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-100 pb-2">
                        At a Glance
                    </h3>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="text-gray-400">Position</dt>
                            <dd className="font-bold text-gray-900 dark:text-white">{bio.position}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400">Height / Weight</dt>
                            <dd className="font-bold text-gray-900 dark:text-white">{bio.height} / {bio.weight} lbs</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400">Experience</dt>
                            <dd className="font-bold text-gray-900 dark:text-white">{bio.experience}</dd>
                        </div>
                        <div>
                            <dt className="text-gray-400">College</dt>
                            <dd className="font-bold text-gray-900 dark:text-white">{bio.college || "N/A"}</dd>
                        </div>
                    </dl>
                </div>

                {/* Social Media Links */}
                {wiki?.socials && wiki.socials.length > 0 && (
                    <div className="glass-card p-6">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 border-b border-gray-100 pb-2">
                            Connect
                        </h3>
                        <div className="flex flex-col gap-3">
                            {wiki.socials.map((social, idx) => (
                                <a
                                    key={idx}
                                    href={social.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-orange-50 dark:hover:bg-orange-900/20 text-gray-700 dark:text-gray-200 transition group"
                                >
                                    <span className="text-xl">
                                        {social.platform === 'X' ? '𝕏' : (social.platform === 'Instagram' ? '📸' : '🔗')}
                                    </span>
                                    <span className="font-bold group-hover:text-orange-600 transition">{social.platform}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
