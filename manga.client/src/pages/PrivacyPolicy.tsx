import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import CustomTocaeruToolbar from '../components/common/CustomTocaeruToolBar';
import { Helmet } from 'react-helmet-async';
import { SERVICE_NAME } from '../serviceName';

const PrivacyPolicy: React.FC = () => {
    const description = `${SERVICE_NAME}のプライバシーポリシー`

    return (
        <>
            <Helmet>
                <title>プライバシーポリシー - {SERVICE_NAME}</title>
                <meta name="description" content={description} />
                <meta property="og:title" content={`プライバシーポリシー - ${SERVICE_NAME}`} />
                <meta property="og:description" content={description} />
                <meta property="og:url" content={window.location.href} />
                <meta name="twitter:title" content={`プライバシーポリシー - ${SERVICE_NAME}`} />
                <meta name="twitter:description" content={description} />
            </Helmet>
            <Box sx={{mx: 1, pb: 3}}>
                <CustomTocaeruToolbar showBackButton showSubtitle subtitle={'プライバシーポリシー'} />
                <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
                    <Typography variant="body2" paragraph>
                        Tocaeruを運営するロードミント株式会社（以下、「当社」という。）は，ユーザーの個人情報について以下のとおりプライバシーポリシー（以下、「本ポリシー」という。）を定めます。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        1．個人情報の取得方法
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社はユーザーが利用登録をするとき、氏名・生年月日・住所・電話番号・メールアドレスなど
                        個人を特定できる情報を取得させていただきます。お問い合わせフォームやコメントの送信時には、
                        氏名・メールアドレスを取得させていただきます。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        2．個人情報の利用目的
                    </Typography>
                    <Typography variant="body2" paragraph>
                        取得した閲覧・購買履歴等の情報を分析し、
                        ユーザー別に適した商品・サービスをお知らせするために利用します。
                        また、取得した閲覧・購買履歴等の情報は、結果をスコア化した上で当該スコアを第三者へ提供します。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        3．個人データを安全に管理するための措置
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は個人情報を正確かつ最新の内容に保つよう努め、
                        不正なアクセス・改ざん・漏えい・滅失及び毀損から保護するため
                        全従業員及び役員に対して教育研修を実施しています。また、個人情報保護規程を設け、
                        現場での管理についても定期的に点検を行っています。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        4．個人データの第三者提供について
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は法令及びガイドラインに別段の定めがある場合を除き、
                        同意を得ないで第三者に個人情報を提供することは致しません。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        5．保有個人データの開示、訂正
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社は本人から個人情報の開示を求められたときには、遅滞なく本人に対しこれを開示します。
                        個人情報の利用目的の通知や訂正、追加、削除、利用の停止、
                        第三者への提供の停止を希望される方は以下の手順でご請求ください。 
                        送付先住所 〒262-0019 千葉県千葉市花見川区朝日ケ丘3-28-26 ロードミント株式会社
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        6．個人情報取り扱いに関する相談や苦情の連絡先
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社の個人情報の取り扱いに関するご質問やご不明点、苦情、
                        その他のお問い合わせはお問い合わせフォームよりご連絡ください。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        7．SSL（Secure Socket Layer）について
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社のWebサイトはSSLに対応しており、WebブラウザとWebサーバーとの通信を暗号化しています。
                        ユーザーが入力する氏名や住所、電話番号などの個人情報は自動的に暗号化されます。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        8．プライバシーポリシーの制定日及び改定日
                    </Typography>
                    <ul>
                        <li>制定：2024年9月2日</li>
                    </ul>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        9．免責事項
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社Webサイトに掲載されている情報の正確性には万全を期していますが、
                        利用者が当社Webサイトの情報を用いて行う一切の行為に関して、一切の責任を負わないものとします。 
                        当社は、利用者が当社Webサイトを利用したことにより生じた利用者の損害及び利用者が第三者に与えた損害に関して、
                        一切の責任を負わないものとします。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        10．著作権・肖像権
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社Webサイト内の文章や画像、すべてのコンテンツは著作権・肖像権等により保護されています。
                        無断での使用や転用は禁止されています。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        11．リンク
                    </Typography>
                    <Typography variant="body2" paragraph>
                        当社Webサイトへのリンクは、自由に設置していただいて構いません。
                        ただし、Webサイトの内容等によってはリンクの設置をお断りすることがあります。
                    </Typography>
                    <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                        12．事業者情報
                    </Typography>
                    <Typography variant="body2" paragraph>
                        法人名：ロードミント株式会社
                    </Typography>
                    <Typography variant="body2" paragraph>
                        住所：〒262-0019 千葉市花見川区朝日ケ丘3-28-26
                    </Typography>
                    <Typography variant="body2" paragraph>
                        代表者：江原 大智
                    </Typography>
                </Container>
            </Box>
        </>
    );
};

export default PrivacyPolicy;
