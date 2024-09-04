import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

const TermsOfService: React.FC = () => {
    const description = `${SERVICE_NAME}の利用規約ページです。サービスを利用するための規則や条件が記載されています。`;

    return (
        <>
            <Helmet>
                <title>利用規約 - {SERVICE_NAME}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`利用規約 - ${SERVICE_NAME}`} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:title" content={`利用規約 - ${SERVICE_NAME}`} />
                <meta name="twitter:description" content={description} />
            </Helmet>
            <Box sx={{mx: 1, pb: 3}}>
                <CustomTocaeruToolbar showBackButton showSubtitle subtitle={'利用規約'}/>
                <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="body2" paragraph>
                        この規約（以下「本規約」といいます）は、ロードミント株式会社（以下「当社」といいます）が提供する、欲しい書籍といらない書籍をマッチングさせ物々交換できるサービス「Tocaeru（トカエル）」（以下「本サービス」といいます）の利用に関する条件を、本サービスを利用する者（以下「ユーザー」といいます）と当社の間で定めるものです。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        本規約は本サービスの利用に関して生ずるすべての関係に適用されるものとし、ユーザーは、本規約を熟読し、本規約の内容を十分に理解した上でこれを承諾して、本サイトを利用するものとします。本サービスを利用することで、下記の利用規約に同意していただいたこととみなさせていただきますのでご注意ください。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第1条（本サービスの利用）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ユーザーは、本規約の定めに従って当サービスを利用しなければなりません。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ユーザーは、サインアップすること又は本サービスを実際に利用することによって、本規約の内容及び本規約が本サービスの利用契約の内容となることに同意したものとみなされます。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第2条（利用者登録）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        本サービス利用希望者は、申し込みフォームに必要事項を正しく記入した上で申し込むものとし、
                        当社から利用者登録が完了した旨を通知された時点又はユーザーが本サービスを実際に利用した時点で、
                        本規約に記載された事項を契約内容とする本サービスの利用契約が成立し、
                        本規約の条件による本サービスの利用の許可が当社よりユーザーに有効に付与されるものとします。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第3条（利用規約の変更について）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は、以下の各号のいずれかに該当する場合、
                        ユーザーにあらかじめ通知することなく、
                        本規約及び本サイトの仕様等を変更することができるものとします。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (1)変更内容がサービス名や表現の変更または誤字、脱字等の修正であり、本利用規約の内容に実質的な影響を与えない場合<br />
                        (2)変更内容がユーザーの一般の利益に適合する場合<br />
                        (3)変更内容が契約をした目的に反せず、かつ、変更の必要性、変更後の内容の相当性その他変更に係る事情に照らして合理的なものである場合<br />
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は、前項第2号及び前項第3号による変更の場合、
                        本規約変更の効力発生の相当期間前までに、
                        本規約を変更する旨及び変更後の本規約の内容並びにその効力発生時期を本サイト等への掲載その他当社が適当と判断する方法により通知します。
                        なお、この変更に起因して生じた直接及び間接的な損害に関して、当社は一切の責任を負いません。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第4条（非保証・免責）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は、提供するサービスの内容について、
                        バグ・不備・コンピュータウィルス等のないことを保証するものではなく、
                        これに起因する直接及び間接的な損害に関する一切の責任を負うものではありません。
                        当社は、本サービスがユーザーの皆様に役立つよう最大限の努力を行いますが、
                        ユーザーに対する当社の責任は、ユーザーが支障なく本サービスを利用できるよう、
                        合理的な努力をもって本サービスを運営することに限られるものとします。
                        本サービスの内容において、欠陥、一時停止、一部削除、変更、終了及びそれらが原因で発生したユーザー又は他者の損害、
                        本サービスの利用により又は利用できなかったことにより発生したユーザーの損害、
                        並びに本サービスに起因するユーザー又は他者の損害に対し、いかなる責任も負わないものとし、
                        損害賠償義務を一切負わないものとします。
                        当社は、本サービスに関連してユーザー間又はユーザーと第三者間で発生した一切のトラブルについて、
                        一切の責任を負わず、関知しません。
                        万一トラブルが生じた場合は、訴訟内外を問わず当事者間で解決するものとし、
                        当該トラブルにより当社が損害を被った場合は、当事者は連帯して当社に対し、
                        当社に生じた弁護士費用を含むすべての費用及び当該損害を賠償するものとします。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第5条（通知または連絡）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は、ユーザーに連絡を行う場合、電子メール、チャット、又は本サイトに掲載する方法のうち、
                        当社が任意に選択した方法により行うものとします。
                        電子メールによる通知は、当社がユーザーにメール送信した時点で効力を発するものとみなし、
                        本サイトへの掲載による通知は、本サイトに掲載した時点で効力を発するものとみなします。
                        当社は、ユーザーからお問い合わせを頂いた場合、原則として電子メールのみで回答するものとします。
                        但し、当社の判断によって、電子メール以外の方法で回答する場合もあるものとします。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第6条（IDやパスワード等の管理）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ユーザーは発行されたID及びパスワードを当社の事前の承諾を得ることなく、第三者に譲渡、
                        貸与若しくは開示し、又は使用させないものとします。
                        ユーザーを特定する所定の認証方法（IDとパスワードの組み合わせや当社が定める他社サービスを利用した認証方法などを指しますが、これらに限られません）
                        によりログインされた場合には、当該ユーザーご自身によるご利用であるとみなします。
                        前項の場合、ユーザーは、本サイトのサービスの利用等によって、料金や代金が発生した場合には、
                        その料金の支払い義務を負うものとし、第三者の使用によること等を理由に支払い義務を免れるものではないものとします。
                    </Typography>


                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第7条（個人情報の取り扱いについて）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は、個人情報及びそれに類する情報を、「プライバシーポリシー」に基づき、
                        適切に取扱うものとします。
                        個人情報の保護に関する法律第23条1項各号に定める事項に該当すると当社が判断する場合には、
                        個人情報を第三者に提供することがあります。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第8条（本サービスの利用条件）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ユーザーは、本規約に反しない範囲において本サービスを利用することができるものとします。 
                        ユーザーは、本サービスの利用にあたり、以下の各号のいずれかに該当する行為をしてはなりません。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (1)法令及び本規約に違反する行為<br />
                        (2)所属する企業又は業界団体等の組織の内部規則等に違反する行為<br />
                        (3)政治的又は宗教的思想を含む情報を提供する行為及び政治的又は宗教的な勧誘を行う行為<br />
                        (4)本サービスと競合するサービス等を宣伝する行為及びこれに類する行為<br />
                        (5)検索エンジンスパム行為及び第三者の検索エンジンスパム行為を直接又は間接的に助長する行為並びにこれらに類する行為<br />
                        (6)本サービス内で不当に情報を操作する行為<br />
                        (7)不正アクセス、改ざん及びコンピュータウィルスや有害なコンピュータプログラム等により当社ウェブサイトを攻撃する行為<br />
                        (8)複数のユーザー名又はパスワードを利用する行為<br />
                        (9)電話による回答を執拗に要求する等、本規約に反する不当な要求を繰り返すなどして、当社に義務のない応答や対応を強要する行為<br />
                        (10)猥褻な情報又は青少年に有害な情報の送信、それらを掲載する他のウェブサイトへの誘導をする行為及びその他猥褻又は青少年に有害な言動を発する行為<br />
                        (11)異性交際に関する情報の送信、その他異性交際を目的として本サービスを利用する行為<br />
                        (12)その他公正な取引慣行に反する行為<br />
                        (13)本サービスの運営を妨害する行為<br />
                        (14)本サイトを介さずに行う直接取引やそれを勧誘する行為、又は、勧誘に応じる行為。（本サービスで取引開始をしたユーザーと再度取引する場合を含む）<br />
                        (15)利用ユーザーの目的と合致しない宣伝広告及び誤解又は損害等を与えるおそれのある行為<br />
                        (16)虚偽の情報を登録・記入・送信する行為<br />
                        (17)過去に本利用規約違反等の理由によりユーザー資格の取り消しを受けていたにも関わらず、ユーザー登録の申込をする行為<br />
                        (18)コンピュータウィルス等の有害なコンピュータプログラム等を送信または頒布する行為、チェーンメール・スパムメール等の送信を目的とする行為、並びに本サービスに著しく負荷のかかる行為<br />
                        (19)本サービスにより利用しうる情報を改ざんまたは消去する行為<br />
                        (20)当社または第三者の財産、プライバシー、名誉または肖像権を侵害する行為、または侵害するおそれのある行為、ストーカー的行為<br />
                        (21)当社または第三者の著作権、特許権、実用新案権、意匠権、商標権及びノウハウ等その他一切の知的財産権を侵害する行為<br />
                        (22)当社または第三者を差別・誹謗中傷し、その名誉または信用を毀損する行為、並びに人種的・民族的・宗教的に不快感を与える行為<br />
                        (23)その他当社が不適切であると判断する行為<br />
                        (24)虚偽の書籍情報の掲載<br />
                        (25)その他当社が不適切であると判断する行為<br />
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ユーザーは、本規約に反しない範囲において本サービスを利用することができるものとします。 
                        ユーザーは、本サービスの利用にあたり、以下の各号のいずれかに該当する行為をしてはなりません。
                    </Typography>

                    {/* 他の条項も同様に追加 */}

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第9条（本サービスの利用料及び支払方法に関する事項）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        本サービスは、会員登録や書籍の出品等無料でご利用頂けます。当社は広告収入によって運営されており、ユーザーに対して利用料を請求することはありません。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第10条（退会）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        退会には下記の2つがあります。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (1)ユーザーによる退会<br />
                        (2)当社による強制退会
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ユーザーによる退会を希望する場合は、当社が定める手続きにより退会することができます。
                        但し、ユーザー間の取引の決済等取引の手続きや、必要情報の入力漏れ等手続きに未了の事項がある等、
                        退会処理を行うことが不都合と当社が判断する場合、当社は、アカウントの停止や機能の制限等必要な措置を取り、
                        未了の事項がなくなるまで当該ユーザーの退会処理を保留することができるものとします。
                        ユーザーにおいて、第８条２項の禁止事項を含む本規約に違反し、
                        当社の警告若しくは注意喚起にもかかわらず、当該違反行為が是正されない場合や、
                        当社への営業妨害等により当社の事業の執行に支障が出た場合には、当社の判断によって、
                        強制退会としたり、会員資格を一時的に停止したり、会員資格に伴う権利を取り消したり、
                        又は、将来にわたって本サービスのご利用をお断りする場合があります。
                        前項の規定により、強制退会となった場合には、当社は、
                        当該ユーザーの退会処理を行うことが適切であると判断するときまで、当該ユーザーにつき、
                        アカウントの停止や機能の制限等必要な措置を取ることができるものとします。
                        但し、当該ユーザーの強制退会及びこれに付随する措置に関連して、直接的又は間接的かにかかわらず、
                        当社に何らかの損害が生じた場合には、強制退会後、当該損害について賠償する責を負うものとします。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第11条（マッチング契約）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        本サイトでは、書籍を提供するユーザーを「提供者」といい、書籍交換の申請をしたユーザーを「希望者」、
                        提供者から希望者として交換が成立したユーザーを「交換成立者」といいます。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        提供者及び希望者は、当社の仲介を経て、書籍交換契約を２者間で直接締結するものとします。
                        但し、上記マッチング契約は、本サイト上で両者の合意が成立した場合に締結されたものとみなし、
                        かつ、下記条項を必ず包含するものであって、これと矛盾するものであってはなりません。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (1)提供者側について
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ア　提供者は、マッチング契約が見込まれる希望者の問い合わせ及び商談等には迅速かつ誠実に対応しなければならない。<br />
                        イ　提供者は、希望者及び交換成立者との間で、双方が滞りなくコミュニケーションが取れ、その履歴がわかる方法で連絡を取らなければならない。<br />
                        ウ　前項のマッチングの内容及び履歴などの著作権は、提供者に帰属するものとみなすが、提供者は、これを当社が閲覧するのに異議を述べず、承諾する。<br />
                        エ　提供者は、マッチング契約を遂行するうえで、第三者の著作権等の知的財産権を侵害してはならない。<br />
                        オ　書籍の交換は、当社を仲介して行うものとし、提供者・交換成立者間での直接取引を禁止する。<br />
                        カ　マッチング契約は、提供者が当社の定める所定の解約手続きを行うことで終了することができる。ただし、交換成立後はキャンセルすることができない。<br />
                        キ　当社は、提供者・交換成立者間のトラブルを解決する義務を負うものではなく、マッチング契約を締結した双方間の紛争には一切関知しないものとし、提供者は事由・名目の如何を問わず、当社にいかなる要求も行ってはならない。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (2)交換成立者側について
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ア　書籍の状態は提供者が出品時に入力した通りであることを前提とする。<br />
                        イ　書籍の交換方法は郵送・配送とし、今後対面での交換も可能となる場合がある。<br />
                        ウ　交換にかかる送料は元払いで発送する側が負担する。<br />
                        エ　交換申請は取り下げることができるが、交換成立後はキャンセルすることができない。<br />
                        オ　当社は、提供者・交換成立者間のトラブルを解決する義務を負うものではなく、マッチング契約を締結した双方間の紛争には一切関知しないものとし、交換成立者は事由・名目の如何を問わず、当社にいかなる要求も行ってはならない。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第12条（ユーザー間の秘密保持）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ユーザーは、ユーザー間の取引又はその成立過程において、
                        取引の相手方たるユーザーから秘密である旨示されて開示される秘密情報、
                        ユーザー間の取引遂行中に知り得た秘密情報及び取引の相手方たるユーザーが保持する個人情報を、
                        すべて秘密として保持し、ユーザー間の取引の目的以外には一切使用せず、第三者に一切開示、
                        漏えいしないものとします。
                        前項の規定に関わらず、以下のいずれかに該当することをユーザーが証明したものついては、
                        秘密情報から除かれるものとします。ただし、個人情報については第6号のみが適用されるものとします。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (1)既に公知、公用の情報。<br />
                        (2)秘密情報の開示後に、ユーザーの責によらず公知、公用となった情報。<br />
                        (3)開示を受けた時点で、既に知得していた情報。<br />
                        (4)開示を受けた後、正当な権限を有する第三者から守秘義務を負うことなしに適法に入手した情報。<br />
                        (5)開示者が、第三者に開示することを文書により承諾した情報。<br />
                        (6)法令又は確定判決等により開示を義務付けられた情報（但し、当該義務の範囲内に限る）。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ユーザーが、秘密情報を利用するにあたっては、
                        開示目的を達成するために最小限必要な範囲・対象者に限定して開示するものとします。
                        この場合、ユーザーは開示した相手方が秘密情報を漏洩もしくは開示目的以外に利用しないよう、
                        監督その他の必要な措置を講ずる義務を負うものとします。
                        ユーザーは、秘密情報を極秘にして扱い、
                        全て合理的な安全管理体制及び漏洩防止手段を講じる義務を負うものとします。
                        ユーザーは、ユーザー間の取引を開始する前に、必要に応じ、別途秘密保持契約を締結し、
                        相互の秘密保持に努めるものとします。この別途秘密保持契約の締結の有無にかかわらず、
                        本サイト上、本条に同意することを表示したユーザー間では、ユーザー間の取引に関し、
                        相互に本条に定める秘密保持義務を負うものとします。
                        当社は、ユーザー間の取引における秘密保持につき、何らこれを保証するものではなく、
                        何らの責任を負わないものとします。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第13条（知的財産権）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        本サービスの利用に際して、当社ウェブサイトにユーザーが掲載・送信した表現物に関する知的財産権は、
                        第三者に帰属するものを除き、全てこれを作成したユーザーに帰属するものとします。
                        当社は、ユーザーの本サービスの利用にかかる統計的集計データを当社の裁量により
                        利用・公表等できるものとし、これに関する知的財産権を有するユーザーは異議を述べず、承諾する。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第14条（サービスの一時的な中断）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は、次の各号いずれかの事由に該当する場合、ユーザーに事前に通知することなく、
                        一時的に本サービスの運営を中断することがあります。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (1)本サービスまたは関連設備の保守を定期的または緊急に行うとき。<br />
                        (2)本サービスで利用する通信回線、電力等の提供が中断されたとき。<br />
                        (3)火災、停電、地震、台風、洪水、津波等の天災や疫病の発生等、
                        当社が支配できない事情（当社が利用しているサーバーで生じた事情を含みます。）により
                        本サービスの運営ができないとき。<br />
                        (4)その他当社が必要と判断したとき。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は、事由の如何を問わず、前項に示す本サービスの運営の遅滞、中断または停止に起因して、
                        ユーザー、顧客または第三者が損害を被った場合であっても、その責任を一切負わないものとします。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第15条（損害賠償）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (1)ユーザーの責任
                    </Typography>
                    <Typography variant="body2" paragraph>
                        ユーザーが本規約に違反した場合、当該ユーザーが、
                        当該違反により損害を受けたユーザー及び第三者に対する損害賠償責任を含む、
                        一切の責任を負うものとします。ユーザーがかかる違反行為を行ったことにより、
                        弊社が損害を被った場合は、当該ユーザーその他関連当事者は連帯して当該損害を賠償するものとします。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (2)弊社の免責
                    </Typography>
                    <Typography variant="body2" paragraph>
                        弊社は、弊社による本サービスの提供の停止、終了又は変更、ユーザー登録の取消、
                        コンテンツの削除又は消失､本サービスの利用によるデータの消失又は機器の故障
                        その他本サービスに関連してユーザーが被った損害につき、弊社の故意又は過失に起因する場合を除き、
                        賠償する責任を負わないものとします。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (3)弊社の責任の範囲
                    </Typography>
                    <Typography variant="body2" paragraph>
                        弊社がユーザーに対して損害賠償責任を負う場合においても、弊社の責任は、
                        弊社の債務不履行又は不法行為によりユーザーに生じた損害のうち現実に発生した直接かつ通常の損害に限るものとします。
                        但し、弊社の故意又は重過失に起因する場合を除きます。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第16条（免責事項）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        本サービスの利用において、
                        ユーザーの責に帰すべき理由より当社その他の第三者に損害が発生した場合または権利が侵害された場合、
                        当該ユーザーは自己の費用と責任において損害を賠償し、または権利侵害状態を解消する等、
                        これを解決するものとします。
                        天災地変、戦争・暴動・内乱、法令の制定・改廃、公権力による命令・処分、ストライキ等の争議行為、輸送機関の事故、
                        その他当事者の責に帰すことのできない事由による本利用規約に基づく債務の履行の遅滞または不能が生じた場合は、
                        当該当事者はその責任を負わないものとします。
                        当社は、以下の各号に該当する損害、ならびに以下の各号に付随する２次的なデータの漏洩、損失、
                        損害にかかる賠償請求等の法的責任及び道義的責任を一切負わないものとします。
                    </Typography>
                    <Typography variant="body2" paragraph>
                        (1)当社が提供していないプログラムによって生じる損害。<br />
                        (2)当社以外の第三者による不正な行為によって生じる損害。<br />
                        (3)ハッカー及びクラッカーによるサーバーへの侵入または攻撃等の行為による損害。<br />
                        (4)当社が本サービスのために用いるサーバーにおいて生じた事情により生じる損害。<br />
                        (5)本サービスのバグによって生じる損害。<br />
                        (6)交換された書籍の品質や状態に関する損害<br />
                        (7)書籍の交換時に発生したトラブルに関する損害
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は、本サービスについて、その完全性及び特定目的適合性その他の事項について保証するものではなく
                        本サービスや本サイトの提供が中断することなく継続することを保証するものでもありません。
                        当社は、前項に示す事由などにより本サービスや本サイトの提供が停止または中止した場合であっても、
                        ユーザーや第三者に生じた損害について責任を負いません。
                        当社は、本サービスにユーザーがアップロードしたデータ・情報の真偽等に関しては、一切責任を負わないものとし、
                        本サービスにアップロードされたデータ・情報の正確性や当該情報をアップデートする責任は、全てユーザーにあります。
                        当社は、本サイトにて第三者の広告の表示・掲載を行う場合がありますが、ユーザーにおいて、
                        本サイトでの広告を通じて第三者から商品・サービスを購入する等、第三者と何らかの契約をされる場合であっても、
                        当該契約の当事者はユーザーと第三者であって、当社はいかなる責任も負いません。
                        ユーザーは、本サービスで保存するデータについて、自らバックアップを行う義務を負うものであって、
                        当社は、本サービスにおいて、当社の管理下にあるインターネットサーバーに保管・蓄積されるユーザーのデータについて
                        バックアップを行うものではありますが、当社によるバックアップにも関わらず、
                        本サービスに保管・蓄積されたユーザーのデータが消失、毀損した場合であっても、
                        当社は、ユーザーや第三者に対していかなる責任も負いません。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第17条（本サービスの終了）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は、相当の期間をもってユーザーに通知の上、
                        利用者に対する本サービス及び本サービスの一部を終了することができるものとします。
                        但し、諸事情によって、上記事前通知を行うことが出来ない場合があり得ることをご了承ください。
                        前項の通知は、本サイト上での掲示及び利用者への電子メールやWebサイト上への掲載によるものとします。
                        本サービスを終了した場合であっても、利用者に対して本サービスは終了に伴い生じる損害、損失、
                        その他の費用の賠償または補償を免れるものとします。
                    </Typography>

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        第18条（合意管轄等）
                    </Typography>
                    <Typography variant="body2" paragraph>
                        本利用規約の準拠法は日本法とし、
                        本利用規約及び本サービスに関する一切の紛争について訴訟の必要が生じた場合、
                        千葉地方裁判所又は千葉簡易裁判所を第一審の専属的合意管轄裁判所とします。
                    </Typography>

                    {/* 残りの条項も同様に追加 */}

                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        附則
                    </Typography>
                    <Typography variant="body2" paragraph>
                        2024年09月02日　制定
                    </Typography>
                </Container>
            </Box>
        </>
  );
};

export default TermsOfService;
