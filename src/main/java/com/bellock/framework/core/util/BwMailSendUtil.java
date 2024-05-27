package com.bellock.framework.core.util;

import java.util.Date;
import java.util.Properties;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import com.bellock.framework.core.annotation.BwSetField;
import com.bellock.framework.core.base.BwAbstractBaseComponent;

import jakarta.annotation.Nullable;
import jakarta.mail.Authenticator;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.PasswordAuthentication;
import jakarta.mail.Session;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import static com.bellock.framework.core.constant.BwConstants.Mail.PropKey.Placeholder.*;


/**
 * 메일을 전송하는 클래스
 * 메일 전송과 관련한 설정은 프로퍼티를 이용해 사용여부 및 관련 환경 설정 정보를
 * 읽어 사용하며, 이런 설정이 없는 경우에도 사용자는 매뉴얼로 각 정보를 설정해
 * 메일 전송을 할 수 있도록 기능을 제공한다.
 * 
 * @since 2024.05, 나인석, 최초작성
 */
@Component
public class BwMailSendUtil extends BwAbstractBaseComponent {
    /**
     * 메일 전송 관련 속성들
     */
    @BwSetField(USED_DEF)
    private String mailUsed;
    @BwSetField(SENDER_DEF)
    private String mailSender;
    @BwSetField(SENDER_NAME_DEF)
    private String mailSenderNm;
    @BwSetField(SENDER_PASSWORD_DEF)
    private String mailPassword;
    @BwSetField(START_TLS_ENABLE_DEF)
    private boolean mailTlsEnable;
    @BwSetField(SMTP_HOST_DEF)
    private String mailSmtpHost;
    @BwSetField(SMTP_AUTH_DEF)
    private boolean mailSmtpAuth;
    @BwSetField(SMTP_PORT_DEF)
    private String mailSmtpPort;
    @BwSetField(SMTP_SSL_ENABLE_DEF)
    private boolean mailSmtpSslEnable;
    @BwSetField(SMTP_SSL_TRUST_DEF)
    private boolean mailSmtpSslTrus;


    /**
     * 메일 전송 메서드
     * 프로퍼티에 저장된 정보를 읽어 메일 전송 설정을 하는 경우와
     * 매뉴얼로 설정해 메일을 보내는 기능도 제공 한다
     * 
     * 만약, 프로퍼티로 메일 정보를 설정하는 경우 메일전송 기능 사용여부도
     * 입력하기 때문에 'N'으로 되어 있는 경우 기능이 동작하지 않는다. 그래서
     * 해당 메서드에서는 매뉴얼 설정 플래그를 두어 true일 경우 프로퍼티에 
     * 사용여부가 'N'으로 설정되어 있더라도 메일 전송 기능을 사용하도록 처리
     * 하였다.
     * 
     * 파라메터가 null로 설정되는 경우 프로퍼티에서 정보를 읽어 온다
     * 
     * @param isMenual 매뉴얼인 경우 메일전송 기능 사용여부를 체크하지 않는다
     * @param recipient 받는 사람 메일 주소
     * @param subject 메일 제목
     * @param content 메일 본문, HTML 스트링도 가능함.
     * @param sender 보내는 사람 메일 주소
     * @param senderName 보내는 사람 이름
     * @param password 보내는 사람 메일의 암호, 메일 암호는 설정하지 않아도 됨
     * @param starttlsEnable TLS 활성화 플래그, true or false 스트링
     * @param smtpHost SMTP 주소
     * @param smtpAuth  true or false 스트링
     * @param smtpPort 포트번호, 587
     * @param smtpSslEnable SSL 활성화 플래그 true or false, null 가능
     * @param smtpSslTrust SSL trust, null 가능
     * @return
     */
    public boolean sendMail(
            boolean isMenual,
            String recipient, String subject, String content,
            @Nullable String sender, 
            @Nullable String senderName,
            @Nullable String password,
            @Nullable boolean starttlsEnable,
            @Nullable String smtpHost,
            @Nullable boolean smtpAuth,
            @Nullable String smtpPort,
            @Nullable boolean smtpSslEnable,
            @Nullable boolean smtpSslTrust) {

        try {
            // 프로퍼티에 메일 사용이 "N"이면 return false
            if (isMenual == false) {
                if (mailUsed == null || mailUsed.equals("N")) {
                    return false;
                }
            }

            // mail sender
            if (sender == null || sender.isEmpty()) {
                sender = mailSender;
                if (sender == null || sender.isEmpty()) {
                    return false;
                }
            }

            // mail sender name
            if (senderName == null || senderName.isEmpty()) {
                senderName = mailSenderNm;
                if (senderName == null || senderName.isEmpty()) {
                    return false;
                }
            }

            // password
            if (password == null) {
                password = mailPassword;
                if (password == null) { password = ""; }
            }

            // mail recipient
            if (recipient == null || recipient.isEmpty()) {
                return false;
            }


            Properties props = System.getProperties();

            if (isMenual != false) {
                starttlsEnable = mailTlsEnable;
            }
            props.put("mail.smtp.starttls.enable", starttlsEnable);

            if (smtpHost == null || smtpHost.isEmpty()) {
                smtpHost = mailSmtpHost;
                if (smtpHost == null || smtpHost.isEmpty()) {
                    return false;
                }
            }
            props.put("mail.smtp.host", smtpHost);

            if (isMenual != false) {
                smtpAuth = mailSmtpAuth;
            }
            props.put("mail.smtp.auth", smtpAuth);

            if (smtpPort == null || smtpPort.isEmpty()) {
                smtpPort = mailSmtpPort;
                if (smtpPort == null || smtpPort.isEmpty()) {
                    return false;
                }
            }
            props.put("mail.smtp.port", smtpPort);

            if (isMenual != false) {
                smtpSslEnable = mailSmtpSslEnable;
            }
            props.put("mail.smtp.ssl.enable", smtpSslEnable);

            if (isMenual != false) {
                smtpSslTrust = mailSmtpSslTrus;
            }
            props.put("mail.smtp.ssl.trust", smtpSslTrust);


            Authenticator auth = new AuthenticatorHandler(sender, password);
            Session session = Session.getDefaultInstance(props, auth);
            MimeMessage msg = new MimeMessage(session);

            msg.setSentDate(new Date());
            InternetAddress from = null;
            from = new InternetAddress(sender, senderName);
            msg.setFrom(from);

            InternetAddress to = new InternetAddress(recipient);
            msg.setRecipient(Message.RecipientType.TO, to);
            msg.setSubject(subject, "EUC-KR");
            msg.setText(content, "EUC-KR");
            msg.setHeader("content-Type", "text/html");

            MailThread mth = new MailThread(msg);
            mth.start();
            return true;
        } catch (Exception e) {
            logger.info("The exception occurred in the sendMail method of the MailSendUtil class!!!");
            return false;
        }
    }

    /**
     * 메일 서버에 인증할 때 사용하는 클래스
     * 보냐는 사람의 메일 주소와 비밀번호를 사용해 인증 처리를 한다
     * 
     * @history: 2024.05, 최초작성
     */
    private class AuthenticatorHandler extends Authenticator {
        PasswordAuthentication pa;

        public AuthenticatorHandler(String sender, String password) {
            pa = new PasswordAuthentication(sender, password);
        }

        /**
         * Called when password authentication is needed.  Subclasses should
         * override the default implementation, which returns null. <p>
         *
         * Note that if this method uses a dialog to prompt the user for this
         * information, the dialog needs to block until the user supplies the
         * information.  This method can not simply return after showing the
         * dialog.
         * 
         * Authenticator클래스의 requestPasswordAuthentication메서드에서 호출되는 함수
         */
        public PasswordAuthentication getPasswordAuthentication() {
            return pa;
        }
    }

    /**
     * 메일 전송 쓰레드
     * 메일 전송시 발생되는 비용으로 인해 쓰레드를 통해 메일 전송을 진행한다
     * 
     * @history: 2024.05, 나인석, 최초작성
     */
    private class MailThread extends Thread {
        private static Logger logger = LoggerFactory.getLogger(MailThread.class);

        /**
         *  Java Mail API에서 이메일 메시지를 표현하는 데 사용되는 클래스
         */
        private MimeMessage mailMessage;

        /**
         * 생성자
         * 호출시 MimeMessage 객체를 넘겨 받는다
         * 
         * @param msg MimeMessage 객체
         */
        public MailThread(MimeMessage msg) {
            mailMessage = msg;
        }

        @Override
        public void run() {
            try {
                Transport.send(mailMessage);
            } catch (MessagingException me) {
                logger.info("MailThread method Exception!!!", me);
            }
        }
    }

}


